import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { resolve } from 'node:path';
import { extractTypeScriptPackageFromImport } from '@/app/utils/parser/typescript/extractTypeScriptPackageFromImport';

describe('[extractTypeScriptPackageFromImport]', () => {
  it('should extract package name correctly from import string', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/typescript/my-app');
    const importString = '@/components/H1';
    expect(extractTypeScriptPackageFromImport(importString)).toBe('src.components');
  });

  it('should extract package name correctly from import string (Windows)', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples\\typescript\\my-app');
    const importString = '@/components/H1';
    expect(extractTypeScriptPackageFromImport(importString)).toBe('src.components');
  });
});
