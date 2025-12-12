import { toPosix } from '@/shared/utils/toPosix';

export const parseProjectPath = () => {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath) throw new Error('Missing ENV: NEXT_PUBLIC_PROJECT_PATH');

  return toPosix(projectPath);
};
