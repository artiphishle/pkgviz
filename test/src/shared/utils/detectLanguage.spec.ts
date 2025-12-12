import { Language } from '@/shared/types';

import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { detectLanguage, isJavaRoot, isTypeScriptRoot } from '@/shared/utils/detectLanguage';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

describe('[detectLanguage]', () => {
  it('detects Java as the correct project language', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { confidence, indicators, language } = await detectLanguage(parseProjectPath());
    expect(indicators).toContain('pom.xml');
    expect(confidence).toBe(1);
    expect(language).toBe(Language.Java);
  });

  it('detects TypeScript as the correct project language', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/typescript/my-app');

    const { confidence, indicators, language } = await detectLanguage(parseProjectPath());
    expect(indicators).toContain('tsconfig.json');
    expect(confidence).toBe(1);
    expect(language).toBe(Language.TypeScript);
  });
});

describe('[isJavaRoot]', () => {
  it('recognizes a Java root by its pom.xml', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    expect(await isJavaRoot(parseProjectPath())).toBe(true);
  });
});

describe('[isTypeScriptRoot', () => {
  it('recognizes a TypeScript root by its tsconfig.json', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/typescript/my-app');

    expect(await isTypeScriptRoot(parseProjectPath())).toBe(true);
  });
});
