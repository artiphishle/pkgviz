import { connection } from 'next/server';

import { WorkspaceView } from '@/features/workspace/adapters/inbound/react/WorkspaceView';
import { loadWorkspaceAsync } from '@/features/workspace/composition/loadWorkspaceAsync';
import { parseProjectPath } from '@/utils/parseProjectPath';

/***
 * Loads one workspace per page request rather than starting analysis from client mount effects.
 * @performance Keep this request-time read dynamic: build-time or persistent caching would hide
 * source edits. Client Strict Mode rendering must not trigger another filesystem analysis.
 */
export default async function Home() {
  await connection();
  const workspace = await loadWorkspaceAsync(parseProjectPath());
  return <WorkspaceView workspace={workspace} />;
}
