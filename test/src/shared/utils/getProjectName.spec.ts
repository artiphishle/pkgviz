import { describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { getProjectName } from '@/shared/utils/getProjectName';

describe('[getProjectName]', () => {
  it('should get the project name from projectPath', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = '/Users/tester/examples/typescript/my-app';
    expect(getProjectName()).toBe('my-app');
  });
});
