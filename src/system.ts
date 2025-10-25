import { execSync } from 'child_process';
import type { Proxy } from './proxy.js';

export function applyProxy(proxy: Proxy | 'none'): void {
  try {
    if (proxy === 'none') {
      execSync('gsettings set org.gnome.system.proxy mode "none"');
      console.log('Proxy disabled.');
      return;
    }

    const { host, port, username, password } = proxy;
    execSync('gsettings set org.gnome.system.proxy mode "manual"');
    execSync(`gsettings set org.gnome.system.proxy.http host "${host}"`);
    execSync(`gsettings set org.gnome.system.proxy.http port ${port}`);
    execSync(`gsettings set org.gnome.system.proxy.https host "${host}"`);
    execSync(`gsettings set org.gnome.system.proxy.https port ${port}`);
    execSync(`gsettings set org.gnome.system.proxy.ftp host "${host}"`);
    execSync(`gsettings set org.gnome.system.proxy.ftp port ${port}`);
    execSync(`gsettings set org.gnome.system.proxy ignore-hosts "['localhost', '127.0.0.1']"`);

    if (username && password) {
      execSync(`gsettings set org.gnome.system.proxy.http authentication-user "${username}"`);
      execSync(`gsettings set org.gnome.system.proxy.http authentication-password "${password}"`);
    } else {
      execSync(`gsettings reset org.gnome.system.proxy.http authentication-user`);
      execSync(`gsettings reset org.gnome.system.proxy.http authentication-password`);
    }

    console.log(`Applied proxy: ${proxy.name} (${host}:${port})`);
  } catch (error) {
    console.error('Error applying proxy:', error instanceof Error ? error.message : String(error));
  }
}