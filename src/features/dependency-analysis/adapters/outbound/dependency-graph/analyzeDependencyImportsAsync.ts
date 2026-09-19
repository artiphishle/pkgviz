import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
  createDependencyGraphAsync,
  type DependencyGraphNodeData,
  type DependencyImportEvidence,
} from '@ankhorage/dependency-graph';

import type { ImportDefinition } from '@/shared/types';
import { toPosix } from '@/shared/utils/toPosix';

interface OrderedImport {
  readonly definition: ImportDefinition;
  readonly position: number;
  readonly ordinal: number;
}

interface AppendEvidenceInput {
  readonly analysisRoot: string;
  readonly evidence: DependencyImportEvidence;
  readonly importNameMode: ImportNameMode;
  readonly imports: Map<string, OrderedImport[]>;
  readonly intrinsicMode: ImportIntrinsicMode;
  readonly ordinal: number;
  readonly pkg: string;
  readonly projectRoot: string;
  readonly sourceTextByFile: Map<string, Promise<string>>;
}

/*** Returns PKGViz import definitions from the canonical dependency analyzer. */
export async function analyzeDependencyImportsAsync(
  projectRoot: string,
  analysisRoot: string = projectRoot,
  importNameMode: ImportNameMode = 'package',
  intrinsicMode: ImportIntrinsicMode = 'canonical'
): Promise<ReadonlyMap<string, readonly ImportDefinition[]>> {
  const graph = await createDependencyGraphAsync({
    projects: [{ id: 'current', rootPath: projectRoot }],
  });
  const nodes = new Map(graph.nodes.map(node => [node.id, node.data] as const));
  const imports = new Map<string, OrderedImport[]>();
  const sourceTextByFile = new Map<string, Promise<string>>();
  let ordinal = 0;

  for (const edge of graph.edges) {
    const target = nodes.get(edge.target);
    if (target === undefined) {
      throw new Error(`Missing dependency-graph target node: ${edge.target}`);
    }

    const pkg = targetPackage(target);
    for (const evidence of edge.data.evidence) {
      if (pkg === '') continue;
      ordinal = await appendEvidenceAsync({
        analysisRoot,
        evidence,
        importNameMode,
        imports,
        intrinsicMode,
        ordinal,
        pkg,
        projectRoot,
        sourceTextByFile,
      });
    }
  }

  return materializeImports(imports);
}

type ImportNameMode = 'package' | 'specifier';
type ImportIntrinsicMode = 'canonical' | 'kotlin-standard-library' | 'python-legacy';

/*** Adds one canonical evidence item while retaining the original source declaration position. */
async function appendEvidenceAsync(input: AppendEvidenceInput): Promise<number> {
  const absoluteSourceFile = path.resolve(input.projectRoot, input.evidence.sourceFile);
  const sourceFile = toPosix(path.relative(input.analysisRoot, absoluteSourceFile));
  const sourceText = await readSourceTextAsync(input.sourceTextByFile, absoluteSourceFile);
  const current = input.imports.get(sourceFile) ?? [];

  current.push({
    definition: {
      name: input.importNameMode === 'specifier' ? input.evidence.specifier : input.pkg,
      pkg: input.pkg,
      isIntrinsic: isIntrinsicImport(input.evidence, input.intrinsicMode),
    },
    position: sourceText.indexOf(input.evidence.specifier),
    ordinal: input.ordinal,
  });
  input.imports.set(sourceFile, current);
  return input.ordinal + 1;
}

/*** Converts collected import evidence into source-order PKGViz definitions. */
function materializeImports(
  imports: ReadonlyMap<string, readonly OrderedImport[]>
): ReadonlyMap<string, readonly ImportDefinition[]> {
  return new Map(
    [...imports].map(([sourceFile, entries]) => [
      sourceFile,
      [...entries]
        .sort((left, right) => {
          const leftPosition = left.position < 0 ? Number.MAX_SAFE_INTEGER : left.position;
          const rightPosition = right.position < 0 ? Number.MAX_SAFE_INTEGER : right.position;
          return leftPosition - rightPosition || left.ordinal - right.ordinal;
        })
        .map(({ definition }) => definition),
    ])
  );
}

/*** Reads source content once so adapter output preserves source declaration order. */
function readSourceTextAsync(
  cache: Map<string, Promise<string>>,
  sourceFile: string
): Promise<string> {
  const cached = cache.get(sourceFile);
  if (cached !== undefined) return cached;

  const sourceText = readFile(sourceFile, 'utf8');
  cache.set(sourceFile, sourceText);
  return sourceText;
}

/*** Preserves PKGViz presentation semantics independently from canonical graph classification. */
function isIntrinsicImport(evidence: DependencyImportEvidence, mode: ImportIntrinsicMode): boolean {
  if (mode === 'canonical') return evidence.classification === 'intrinsic';
  if (mode === 'python-legacy') return evidence.specifier.startsWith('.');

  return (
    evidence.specifier.startsWith('kotlin.') ||
    evidence.specifier.startsWith('java.') ||
    evidence.specifier.startsWith('javax.')
  );
}

/*** Maps canonical dependency-graph node metadata to PKGViz package notation. */
function targetPackage(target: DependencyGraphNodeData): string {
  if (target.kind === 'module') return target.path ?? '';
  if (target.classification === 'intrinsic' && target.focus && target.path === '.') return '';
  return target.packageName ?? target.label;
}
