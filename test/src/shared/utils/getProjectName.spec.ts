import { describe,expect,it, } from '@artiphishle/testosterone';
import { getProjectName } from '@/shared/utils/getProjectName';

describe('[getProjectName]', () => {
  it('should get the project name from projectPath', () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = '/Users/tester/examples/typescript/my-app';
    expect(getProjectName()).toBe('my-app');
  });
});
