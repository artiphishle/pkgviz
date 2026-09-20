import { resolve } from 'node:path';

import { readProjectSnapshotAsync } from '@/features/project-analysis/adapters/outbound/filesystem/readProjectSnapshotAsync';
import { createProjectSnapshotReader } from '@/features/project-analysis/application/use-cases/createProjectSnapshotReader';
import type { ProjectSnapshot } from '@/types/projectAnalysis';

/*** Wires the filesystem reader to process-local in-flight sharing using normalized project paths. */
export function loadProjectSnapshotAsync(projectPath: string): Promise<ProjectSnapshot> {
  return reader.readAsync(resolve(projectPath));
}

const reader = createProjectSnapshotReader({ readAsync: readProjectSnapshotAsync });
