import { describe,expect,it, } from '@artiphishle/testosterone';
import { toPosix } from '@/shared/utils/toPosix';

describe('[toPosix]', () => {
  it('should convert Windows paths to POSIX format', () => {
    const windowsPath = 'C:\\Users\\User\\Documents\\Project';
    const posixPath = toPosix(windowsPath);

    expect(posixPath).toBe('C:/Users/User/Documents/Project');
  });
});
