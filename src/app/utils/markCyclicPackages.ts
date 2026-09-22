import path from 'node:path';

import { findCyclePath, findCyclicComponents } from '@ankhorage/graph';

import type { ParsedDirectory, ParsedFile } from '@/shared/types';
import type { CycleEdgeEvidence, ImportEvidence, PackageCycleDetail } from '@/types/audit';
import type { PackageDependencyGraph } from '@/types/dependencyAnalysis';

/*** Detect package cycles directly on the canonical package projection and retain owner evidence. */
export function getPackageCyclesWithMembers(
  dir: ParsedDirectory,
  graph: PackageDependencyGraph
): {
  cycles: PackageCycleDetail[];
  packageSet: Set<TUniquePackageName>;
  graph: PackageDependencyGraph;
} {
  const sccs = findCyclicComponents(graph);
  const files = collectFiles(dir);
  const cycles: PackageCycleDetail[] = [];
  const packageSet = new Set<TUniquePackageName>();

  for (const scc of sccs) {
    scc.forEach(packageName => packageSet.add(packageName));
    const cycle = [...(findCyclePath(graph, scc) ?? [...scc, scc[0]])];
    cycles.push({
      packages: cycle,
      edges: cycle.slice(0, -1).map((from, index) =>
        cycleEdgeEvidence(graph, files, from, cycle[index + 1])
      ),
    });
  }

  return { cycles, packageSet, graph };
}

type TUniquePackageName = string;

/*** Collect parsed file identity metadata without consulting parser dependency metadata. */
function collectFiles(root: ParsedDirectory): readonly ParsedFile[] {
  return Object.values(root).flatMap(entry =>
    isParsedFile(entry) ? [entry] : collectFiles(entry)
  );
}

/*** Distinguish parsed files from recursive directory records. */
function isParsedFile(entry: ParsedDirectory | ParsedFile): entry is ParsedFile {
  return 'path' in entry && typeof entry.path === 'string' && 'package' in entry;
}

/*** Project canonical edge evidence into the audit contract for one cycle step. */
function cycleEdgeEvidence(
  graph: PackageDependencyGraph,
  files: readonly ParsedFile[],
  from: string,
  to: string
): CycleEdgeEvidence {
  const edge = graph.edges.find(candidate => candidate.source === from && candidate.target === to);
  return {
    from,
    to,
    via: edge?.data.evidence.map(evidence => projectImportEvidence(files, evidence)) ?? [],
  };
}

/*** Add parser-owned file identity to one canonical dependency evidence item. */
function projectImportEvidence(
  files: readonly ParsedFile[],
  evidence: PackageDependencyGraph['edges'][number]['data']['evidence'][number]
): ImportEvidence {
  const file = findParsedFile(files, evidence.sourceFile);
  const filePath = file?.path ?? evidence.sourceFile;
  return {
    filePath,
    fileClass: file?.className ?? path.basename(filePath, path.extname(filePath)),
    importName: evidence.specifier,
    isIntrinsic:
      evidence.classification === 'intrinsic' || evidence.classification === 'focus',
  };
}

/*** Match owner-relative source evidence to the Tree-relative parser file path. */
function findParsedFile(
  files: readonly ParsedFile[],
  sourceFile: string
): ParsedFile | undefined {
  return files.find(
    file => sourceFile === file.path || sourceFile.endsWith(`/${file.path}`)
  );
}
