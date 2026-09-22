import { connection } from 'next/server';

import { loadProjectOverviewAsync } from '@/features/workspace/composition/loadProjectOverviewAsync';
import HomeScreen from '@/screens/home/Home';
import { parseProjectPath } from '@/utils/parseProjectPath';
import { runProjectAnalysisActionAsync } from '@/utils/runProjectAnalysisActionAsync';

/***
 * Loads one overview per page request rather than starting analysis from client mount effects.
 * @performance Keep this request-time read dynamic: build-time or persistent caching would hide
 * source edits. Client Strict Mode rendering must not trigger another filesystem analysis.
 */
export default async function Home() {
  await connection();
  const project = await runProjectAnalysisActionAsync(() =>
    loadProjectOverviewAsync(parseProjectPath())
  );
  return <HomeScreen project={project} />;
}
