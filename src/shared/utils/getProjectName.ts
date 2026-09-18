import { parseProjectPath } from '@/shared/utils/parseProjectPath';
import { toPosix } from '@/shared/utils/toPosix';

/*** Returns the project name for an explicit or configured project path. */
export const getProjectName = (projectPath: string = parseProjectPath()) =>
  toPosix(projectPath).split('/').pop() || '{unknown}';
