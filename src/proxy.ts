export type Proxy = {
  name: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
};

export function parseProxyUrl(proxy: Proxy): string {
  const auth = proxy.username && proxy.password ? `${proxy.username}:${proxy.password}@` : '';
  return `http://${auth}${proxy.host}:${proxy.port}`;
}