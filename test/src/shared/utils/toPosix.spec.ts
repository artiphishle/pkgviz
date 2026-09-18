import { describe, it } from 'node:test';
import { toPosix } from '@/shared/utils/toPosix';
import { expect } from '@artiphishle/testosterone/src/matchers';

describe('[toPosix]', () => {
  it('should convert Windows paths to POSIX format', () => {
    const windowsPath = 'C:\\Users\\User\\Documents\\Project';
    const posixPath = toPosix(windowsPath);

    expect(posixPath).toBe('C:/Users/User/Documents/Project');
  });

  it('normalizes project-relative parser paths without changing POSIX paths', () => {
    expect(toPosix('src\\main\\java\\com\\example\\App.java')).toBe(
      'src/main/java/com/example/App.java'
    );
    expect(toPosix('src/main/java/com/example/App.java')).toBe(
      'src/main/java/com/example/App.java'
    );
  });
});
