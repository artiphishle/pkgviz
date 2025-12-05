import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { isJavaRoot, isTypeScriptRoot } from '@/app/utils/detectLanguage';
import { parseProjectPath } from '@/contexts/parseEnv';

describe('[isTypeScriptRoot', () => {
  it('recognizes a TypeScript root by its tsconfig.json', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd());

    expect(await isTypeScriptRoot(parseProjectPath())).toBe(true);
  });
});

describe('[isJavaRoot]', () => {
  it('recognizes a Java root by its pom.xml', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    expect(await isJavaRoot(parseProjectPath())).toBe(true);
  });
});
