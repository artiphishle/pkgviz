import { analyzeDependencyImportsAsync } from './analyzeDependencyImportsAsync';

/*** Returns PKGViz imports indexed by source file from the canonical TypeScript analyzer. */
export async function analyzeTypeScriptImportsAsync(projectRoot: string) {
  return analyzeDependencyImportsAsync(projectRoot);
}
