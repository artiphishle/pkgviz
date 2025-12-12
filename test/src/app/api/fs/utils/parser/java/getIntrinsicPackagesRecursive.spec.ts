import { resolve } from 'node:path';
import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { getIntrinsicPackagesRecursive } from '@/app/utils/parser/java/getIntrinsicPackagesRecursive';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

describe('[getIntrinsicPackagesRecursive]', () => {
  it('Finds "com" package and all sub packages', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');
    const projectPath = parseProjectPath();
    const intrinsicPackages = (await getIntrinsicPackagesRecursive(projectPath)).sort();

    expect(intrinsicPackages.length).toBe(4);
    expect(intrinsicPackages[0]).toBe('com.example.myapp.a');
    expect(intrinsicPackages[1]).toBe('com.example.myapp.b');
    expect(intrinsicPackages[2]).toBe('com.example.myapp.c');
    expect(intrinsicPackages[3]).toBe('com.example.myapp.d');
  });
});
