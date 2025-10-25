import inquirer, {type DistinctQuestion} from 'inquirer';
import type { Proxy } from './proxy.js';
import { loadProxies, saveProxies } from './config.js';
import { applyProxy } from './system.js';

interface ProxyAnswers {
  name: string;
  host: string;
  port: string;
  username?: string;
  password?: string;
}

async function manageProxy(action: 'add' | 'edit', existingProxy?: Proxy): Promise<void> {
  const questions: DistinctQuestion<ProxyAnswers>[] = [
    {
      type: 'input',
      name: 'name',
      message: 'Proxy name (e.g., Work, Home, College):',
      default: () => existingProxy?.name ?? '',
      validate: (input: string) => (input.trim() ? true : 'Name is required'),
    },
    {
      type: 'input',
      name: 'host',
      message: 'Proxy host (e.g., 172.30.34.248):',
      default: () => existingProxy?.host ?? '',
      validate: (input: string) => (input.trim() ? true : 'Host is required'),
    },
    {
      type: 'input',
      name: 'port',
      message: 'Proxy port (e.g., 8080):',
      default: () => existingProxy?.port.toString() ?? '8080',
      validate: (input: string) => (!isNaN(parseInt(input)) ? true : 'Port must be a number'),
    },
    {
      type: 'input',
      name: 'username',
      message: 'Username (leave blank if none):',
      default: () => existingProxy?.username ?? '',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password (leave blank if none):',
      default: () => existingProxy?.password ?? '',
      when: (answers: Partial<ProxyAnswers>) => !!answers.username,
    },
  ];

  const answers = await inquirer.prompt<ProxyAnswers>(questions);

  const proxy: Proxy = {
    name: answers.name,
    host: answers.host,
    port: parseInt(answers.port),
    ...(answers.username && answers.username.trim() ? { username: answers.username } : {}),
    ...(answers.password && answers.password.trim() ? { password: answers.password } : {}),
  };

  const proxies = loadProxies();
  if (action === 'edit' && existingProxy) {
    const index = proxies.findIndex(p => p.name === existingProxy.name);
    if (index !== -1) proxies[index] = proxy;
  } else {
    proxies.push(proxy);
  }
  saveProxies(proxies);
  console.log(`${action === 'edit' ? 'Edited' : 'Added'} proxy: ${proxy.name}`);
}

async function proxyActions(proxy: Proxy): Promise<void> {
  const { action } = await inquirer.prompt<{ action: 'Connect' | 'Edit' | 'Delete' }>([
    {
      type: 'list',
      name: 'action',
      message: `Select action for ${proxy.name}:`,
      choices: ['Connect', 'Edit', 'Delete'],
    },
  ]);

  if (action === 'Connect') {
    applyProxy(proxy);
  } else if (action === 'Edit') {
    await manageProxy('edit', proxy);
  } else if (action === 'Delete') {
    const proxies = loadProxies().filter(p => p.name !== proxy.name);
    saveProxies(proxies);
    console.log(`Deleted proxy: ${proxy.name}`);
  }
}

export async function mainMenu(): Promise<void> {
  while (true) {
    const proxies = loadProxies();
    const choices: { name: string; value: Proxy | 'none' | 'add' | 'exit' }[] = [
      ...proxies.map(p => ({ name: p.name, value: p })),
      { name: 'No Proxy', value: 'none' },
      { name: 'Add New Proxy', value: 'add' },
      { name: 'Exit', value: 'exit' },
    ];

    const { selection } = await inquirer.prompt<{ selection: Proxy | 'none' | 'add' | 'exit' }>([
      {
        type: 'list',
        name: 'selection',
        message: 'Select a proxy or action:',
        choices,
        loop: true,
      },
    ]);

    if (selection === 'exit') {
      console.log('Exiting proxy switcher.');
      break;
    } else if (selection === 'add') {
      await manageProxy('add');
    } else if (selection === 'none') {
      applyProxy('none');
    } else {
      await proxyActions(selection);
    }
  }
}