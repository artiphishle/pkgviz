import { parseProjectPath } from '@/shared/utils/parseProjectPath';

/*** Returns the configured project name. */
export const getProjectName = () => parseProjectPath().split('/').pop() || '{unknown}';
