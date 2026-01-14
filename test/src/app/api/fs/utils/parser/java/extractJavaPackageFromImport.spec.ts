import { describe,expect,it, } from '@artiphishle/testosterone';
import {
  extractJavaPackageFromImport,
  extractJavaPackageFromReversedImportArray,
} from '@/app/utils/parser/java/extractJavaPackageFromImport';

describe('[extractJavaPackageFromReversedImportArray]', () => {
  // Helper that resolves package from reversed import array
  it('extracts correct package from reversed import array', () => {
    const t = { in: 'com.java.A'.split('.').reverse(), out: 'com.java' };
    const result = extractJavaPackageFromReversedImportArray(t.in);

    expect(result).toBe(t.out);
  });
});

describe('[extractJavaPackageFromImport]', () => {
  // Resolve package from normal class import
  it('extracts correct package from import', () => {
    const t = { in: 'com.java.A', out: 'com.java' };
    const result = extractJavaPackageFromImport(t.in);

    expect(result).toBe(t.out);
  });

  // Resolve package from nested class import
  it('extracts correct package from nested import', () => {
    const t = { in: 'com.java.A.B', out: 'com.java' };
    const result = extractJavaPackageFromImport(t.in);

    expect(result).toBe(t.out);
  });
});
