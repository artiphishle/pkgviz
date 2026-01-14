import { describe,expect,it, } from '@artiphishle/testosterone';
import { parseEnv } from '@/shared/utils/parseEnv';

describe('[parseEnv]', () => {
  it('parses "" correctly to undefined', () => {
    process.env.NEXT_PUBLIC_TEST = '';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    expect(result).toBeUndefined();
  });

  // Parse 'false' to boolean
  it('parses "false" correctly to boolean', () => {
    process.env.NEXT_PUBLIC_TEST = 'false';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    expect(result).toBe(false);
  });

  // Parse 'true' to boolean
  it('parses "true" correctly to boolean', () => {
    process.env.NEXT_PUBLIC_TEST = 'true';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    expect(result).toBe(true);
  });

  it('parses a number correctly', () => {
    process.env.NEXT_PUBLIC_TEST = '123';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    expect(result).toBe(123);
  });
});
