import { toPortablePath } from '@ankhorage/utility/node/path';

import { parseProjectPath } from '@/utils/parseProjectPath';

/*** Returns the project name for an explicit or configured project path. */
export const getProjectName = (projectPath: string = parseProjectPath()) => {
  const projectName = toPortablePath(projectPath).split('/').pop();
  return projectName === undefined || projectName.length === 0 ? '{unknown}' : projectName;
};
