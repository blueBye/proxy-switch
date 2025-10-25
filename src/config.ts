import fs from 'fs';
import os from 'os';
import path from 'path';
import type { Proxy } from './proxy.js';

const CONFIG_FILE = path.join(os.homedir(), '.proxy-switcher.json');

export function loadProxies(): Proxy[] {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) as Proxy[];
    }
    return [];
  } catch (error) {
    console.error('Error loading proxies:', error instanceof Error ? error.message : String(error));
    return [];
  }
}

export function saveProxies(proxies: Proxy[]): void {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(proxies, null, 2));
  } catch (error) {
    console.error('Error saving proxies:', error instanceof Error ? error.message : String(error));
  }
}