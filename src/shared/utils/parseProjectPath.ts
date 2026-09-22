import { toPortablePath } from '@ankhorage/utility/node/path';

/*** Returns the configured project path in portable POSIX form. */
export const parseProjectPath = () => {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath) throw new Error('Missing ENV: NEXT_PUBLIC_PROJECT_PATH');

  return toPortablePath(projectPath);
};
