import { parseProjectPath } from '@/shared/utils/parseProjectPath';

export const getProjectName = () => parseProjectPath().split('/').pop() || '{unknown}';
