#!/usr/bin/env bun
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as net from 'node:net';
import { dirname, resolve } from 'node:path';
import { spawn } from 'child_process';
import { getAuditAction } from '../src/app/actions/audit.actions';

interface Opts {
  out: string;
  open: boolean;
  serve: boolean;
  prod: boolean;
  waitMs: number;
  pretty: boolean;
  verbose: boolean;
  port?: number;
}

function parseArgs(argv: string[]): Opts {
  const o: Opts = {
    out: 'audit.json',
    open: false,
    serve: false,
    prod: false,
    port: undefined,
    waitMs: 90_000,
    pretty: true,
    verbose: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-o' || a === '--out') o.out = argv[++i]!;
    else if (a === '--open') o.open = true;
    else if (a === '--serve') o.serve = true;
    else if (a === '--prod') o.prod = true;
    else if (a === '-p' || a === '--port') o.port = Number(argv[++i]);
    else if (a === '--wait') o.waitMs = Number(argv[++i]);
    else if (a === '--no-pretty') o.pretty = false;
    else if (a === '-v' || a === '--verbose') o.verbose = true;
    else if (a === '-h' || a === '--help') {
      printHelp();
      process.exit(0);
    }
  }
  return o;
}

function printHelp() {
  console.log(`
Usage:
  bunx @your-scope/myapp [options]

Options:
  -o, --out <file>   Output file (default: audit.json in caller's cwd)
  --open             Open the viewer UI after export
  --serve            Keep server running after export (implies --open unless exporting only)
  --prod             Use "next start" if a build exists inside the package
  -p, --port <n>     Port to use (default: find free)
  --wait <ms>        Max wait for server & route (default: 90000)
  --no-pretty        Write minified JSON
  -v, --verbose      Verbose logs
  -h, --help         Show help

Behavior:
  - Starts the packaged Next.js app from inside this npm package.
  - Passes ANALYZE_ROOT = process.cwd() (the caller's project root).
  - Calls server action to retrieve JSON, writes it to --out, then exits (unless --open/--serve).
`);
}

function logv(v: boolean, ...args: unknown[]) {
  if (v) console.log('[myapp]', ...args);
}

async function findFreePort(preferred?: number): Promise<number> {
  const tryPort = (port: number) =>
    new Promise<boolean>(resolvePort => {
      const srv = net.createServer().once('error', () => resolvePort(false));
      srv.listen(port, () => srv.close(() => resolvePort(true)));
    });

  if (preferred && (await tryPort(preferred))) return preferred;
  for (const port of [3000, 3001, 3030, 4000, 5173, 8787, 0]) {
    if (await tryPort(port)) {
      if (port === 0) {
        const srv = net.createServer();
        await new Promise<void>(r => srv.listen(0, r));
        const addr = srv.address();
        const free = typeof addr === 'object' && addr ? addr.port : 3000;
        await new Promise<void>(r => srv.close(() => r()));
        return free;
      }
      return port;
    }
  }
  throw new Error('No free port found');
}

function resolvePackageRoot(): string {
  // bin is at <pkgRoot>/bin/pkgviz.ts; step up to package root
  const here = fileURLToPath(new URL(import.meta.url));
  return resolve(dirname(here), '..');
}

function resolveNextBin(pkgRoot: string): string {
  const local = resolve(
    pkgRoot,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'next.cmd' : 'next'
  );
  if (existsSync(local)) return local;
  return 'next'; // fallback to PATH
}

function openBrowser(url: string) {
  const cmd =
    process.platform === 'darwin'
      ? ['open', url]
      : process.platform === 'win32'
        ? ['cmd', '/c', 'start', '', url]
        : ['xdg-open', url];
  spawn(cmd[0], cmd.slice(1), { detached: true, stdio: 'ignore' });
}

async function main() {
  const opts = parseArgs(process.argv);
  const callerRoot = process.cwd(); // The project being analyzed

  if (!opts.open && !opts.serve) {
    logv(opts.verbose, `Running audit for ${callerRoot}`);

    // Set environment for the action
    process.env.NEXT_PUBLIC_PROJECT_PATH = callerRoot;

    // Call server action directly
    const data = await getAuditAction();

    // write to caller's directory
    const outPath = resolve(callerRoot, opts.out);
    await mkdir(dirname(outPath), { recursive: true });
    const body = opts.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    await writeFile(outPath, body, 'utf8');
    console.log(`✓ audit.json written → ${outPath}`);
    return;
  }

  const port = await findFreePort(opts.port);
  const pkgRoot = resolvePackageRoot(); // The packaged Next app root
  const nextBin = resolveNextBin(pkgRoot);
  const hasBuild = existsSync(resolve(pkgRoot, '.next'));
  const mode = opts.prod || hasBuild ? 'start' : 'dev';

  const nodeEnv = mode === 'start' ? ('production' as const) : ('development' as const);
  const env = {
    ...process.env,
    NEXT_PUBLIC_PROJECT_PATH: callerRoot,
    PORT: String(port),
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: nodeEnv,
  };

  logv(opts.verbose, `Starting Next (${mode}) at ${pkgRoot} on :${port}`);
  const child = spawn(nextBin, [mode, '-p', String(port)], {
    cwd: pkgRoot,
    env: env as NodeJS.ProcessEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (opts.verbose) {
    child.stdout?.on('data', data => {
      process.stdout.write(data);
    });
    child.stderr?.on('data', data => {
      process.stderr.write(data);
    });
  }

  const base = `http://localhost:${port}`;

  await new Promise(r => setTimeout(r, 2000));

  const ui = `${base}/?cwd=${encodeURIComponent(callerRoot)}`;
  openBrowser(ui);

  if (opts.serve) {
    console.log(`Serving UI at ${base} (NEXT_PUBLIC_PROJECT_PATH=${callerRoot})`);
    // don't exit; keep Next running
    return;
  }

  // else, terminate Next after a delay
  await new Promise(r => setTimeout(r, 1000));
  try {
    child.kill('SIGTERM');
    await new Promise(r => setTimeout(r, 800));
    if (child.exitCode === null) child.kill('SIGKILL');
  } catch {}
}

main().catch(err => {
  console.error('✖ myapp failed:', err?.message || err);
  process.exit(1);
});
