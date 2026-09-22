import type { AuditRuleConfiguration } from '@/types/audit';
import type { PkgvizCliOptions } from '@/types/cli';

/*** Parses PKGViz command-line arguments into immutable CLI options. */
export function parsePkgvizCliArgs(argv: readonly string[]): PkgvizCliOptions {
  return parseTokens(argv.slice(2), DEFAULT_OPTIONS);
}

const DEFAULT_OPTIONS: PkgvizCliOptions = {
  out: 'audit.json',
  open: false,
  serve: false,
  prod: false,
  waitMs: 90_000,
  pretty: true,
  verbose: false,
  failOnRuleViolation: true,
  help: false,
  rules: [],
};

/*** Recursively consumes CLI tokens without mutable parser state. */
function parseTokens(
  tokens: readonly string[],
  options: PkgvizCliOptions
): PkgvizCliOptions {
  const [argument, ...rest] = tokens;
  if (argument === undefined) return options;

  if (argument === '-o' || argument === '--out') {
    const [value, ...tail] = readRequiredValue(argument, rest);
    return parseTokens(tail, { ...options, out: value });
  }
  if (argument === '--open') return parseTokens(rest, { ...options, open: true });
  if (argument === '--serve') return parseTokens(rest, { ...options, serve: true });
  if (argument === '--prod') return parseTokens(rest, { ...options, prod: true });
  if (argument === '-p' || argument === '--port') {
    const [value, ...tail] = readRequiredValue(argument, rest);
    return parseTokens(tail, { ...options, port: Number(value) });
  }
  if (argument === '--wait') {
    const [value, ...tail] = readRequiredValue(argument, rest);
    return parseTokens(tail, { ...options, waitMs: Number(value) });
  }
  if (argument === '--no-pretty') return parseTokens(rest, { ...options, pretty: false });
  if (argument === '--no-fail-on-rule-violation') {
    return parseTokens(rest, { ...options, failOnRuleViolation: false });
  }
  if (argument === '-v' || argument === '--verbose') {
    return parseTokens(rest, { ...options, verbose: true });
  }
  if (argument === '-h' || argument === '--help') {
    return parseTokens(rest, { ...options, help: true });
  }
  if (argument === '--rule') {
    const [value, ...tail] = readRequiredValue(argument, rest);
    return parseTokens(tail, {
      ...options,
      rules: [...options.rules, parseRuleConfiguration(value)],
    });
  }

  return parseTokens(rest, options);
}

/*** Reads one required option value and returns it together with the unconsumed tail. */
function readRequiredValue(
  option: string,
  tokens: readonly string[]
): readonly [string, ...string[]] {
  const [value, ...tail] = tokens;
  if (value === undefined) throw new Error(`${option} requires a value.`);
  return [value, ...tail];
}

/*** Parses one CLI audit-rule override without accepting unknown rule IDs or modes. */
function parseRuleConfiguration(value: string): AuditRuleConfiguration {
  const separator = value.indexOf('=');
  if (separator <= 0 || separator === value.length - 1) {
    throw new Error(`Invalid --rule value "${value}". Expected <id>=<off|audit|block>.`);
  }

  const id = value.slice(0, separator);
  const mode = value.slice(separator + 1);
  if (id !== 'cyclic-dependencies') throw new Error(`Unknown audit rule "${id}".`);
  if (mode !== 'off' && mode !== 'audit' && mode !== 'block') {
    throw new Error(`Invalid mode "${mode}" for rule "${id}".`);
  }

  return { id, mode };
}
