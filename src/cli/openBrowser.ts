import { spawn } from 'node:child_process';

/***
 * Opens an HTTP(S) URL with the platform browser without invoking a command shell.
 */
export function openBrowser(url: string): void {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error(`Unsupported browser URL protocol: ${parsedUrl.protocol}`);
  }

  const { href } = parsedUrl;
  const options = {
    detached: true,
    stdio: 'ignore' as const,
    shell: false,
  };

  if (process.platform === 'darwin') {
    spawn('open', [href], options);
    return;
  }

  if (process.platform === 'win32') {
    spawn('rundll32.exe', ['url.dll,FileProtocolHandler', href], options);
    return;
  }

  spawn('xdg-open', [href], options);
}
