import { buildGraph } from '@/app/utils/buildGraph';
import { getParsedFileStructure } from '@/app/utils/getParsedFileStructure';
import { inspectParserLanguageAsync } from '@/app/utils/inspectParserLanguageAsync';
import type { ProjectSnapshot } from '@/types/projectAnalysis';

/*** Reads one project's language and source files and constructs its shared weighted graph. */
export async function readProjectSnapshotAsync(projectPath: string): Promise<ProjectSnapshot> {
  const timeStart = Date.now();
  const language = await inspectParserLanguageAsync(projectPath);
  const files = await getParsedFileStructure(language.language, projectPath);
  return { files, graph: buildGraph(files), language, projectPath, timeStart };
}
