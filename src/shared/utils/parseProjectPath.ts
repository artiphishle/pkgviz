import { toPosix } from '@/shared/utils/toPosix';

/*** Returns the configured project path in POSIX form. */
export const parseProjectPath = () => {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath) throw new Error('Missing ENV: NEXT_PUBLIC_PROJECT_PATH');

  return toPosix(projectPath);
};
