import { buildGraph } from '@/app/utils/buildGraph';
import { selectParserLanguage } from '@/app/utils/selectParserLanguage';
import { inspectProjectForAnalysisAsync } from '@/features/project-analysis/adapters/outbound/project-detector/inspectProjectForAnalysisAsync';
import { parseProjectInspectionAsync } from '@/features/project-analysis/adapters/outbound/project-detector/parseProjectInspectionAsync';
import type { ProjectSnapshot } from '@/types/projectAnalysis';

/*** Reads one project inventory once and constructs its parsed tree and shared weighted graph. */
export async function readProjectSnapshotAsync(projectPath: string): Promise<ProjectSnapshot> {
  const timeStart = Date.now();
  const inspection = await inspectProjectForAnalysisAsync(projectPath);
  const language = selectParserLanguage(inspection.detection);
  const files = await parseProjectInspectionAsync(inspection, language.language, projectPath);
  return { files, graph: buildGraph(files), language, projectPath, timeStart };
}
