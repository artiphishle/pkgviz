import { Language } from '@/shared/types';

import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { detectLanguage } from '@/app/utils/detectLanguage';
import { parseProjectPath } from '@/contexts/parseEnv';

describe('[detectLanguage]', () => {
  it('detects correct project language', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');

    const { confidence, indicators, language } = await detectLanguage(parseProjectPath());

    expect(indicators).toContain('pom.xml');
    expect(confidence).toBe(1);
    expect(language).toBe(Language.Java);
  });
});
