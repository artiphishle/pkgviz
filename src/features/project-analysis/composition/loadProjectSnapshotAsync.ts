import { resolve } from 'node:path';

import { createProjectSnapshotReader } from '@/features/project-analysis/application/use-cases/createProjectSnapshotReader';
import { readProjectSnapshotAsync } from '@/features/project-analysis/composition/readProjectSnapshotAsync';
import type { ProjectSnapshot } from '@/types/projectAnalysis';

/*** Wires the filesystem reader to process-local in-flight sharing using normalized project paths. */
export function loadProjectSnapshotAsync(projectPath: string): Promise<ProjectSnapshot> {
  return reader.readAsync(resolve(projectPath));
}

const reader = createProjectSnapshotReader({ readAsync: readProjectSnapshotAsync });
