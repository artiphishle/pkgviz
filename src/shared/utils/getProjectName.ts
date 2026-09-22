import { toPortablePath } from '@ankhorage/utility/node/path';

import { parseProjectPath } from '@/shared/utils/parseProjectPath';

/*** Returns the project name for an explicit or configured project path. */
export const getProjectName = (projectPath: string = parseProjectPath()) =>
  toPortablePath(projectPath).split('/').pop() || '{unknown}';
