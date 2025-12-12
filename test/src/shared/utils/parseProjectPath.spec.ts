import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

describe('[parseProjectPath]', () => {
  it('should parse project path from environment variable', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = '/Users/tester/examples/typescript/my-app';
    expect(parseProjectPath()).toBe('/Users/tester/examples/typescript/my-app');
  });
});
