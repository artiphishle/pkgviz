import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { extractTypeScriptPackageFromImport } from '@/app/utils/parser/typescript/extractTypeScriptPackageFromImport';

describe('[extractTypeScriptPackageFromImport]', () => {
  // Path alias '@' has to be resolved to 'src'
  it('extracts @ alias is correctly resolved to src', () => {
    const t = { in: '@/utils/parser/PseudoParser', out: 'src.utils.parser' };
    const result = extractTypeScriptPackageFromImport(t.in);

    expect(result).toBe(t.out);
  });
});
