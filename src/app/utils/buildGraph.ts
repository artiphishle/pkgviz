import type {
  EdgeDataDefinition,
  EdgeDefinition,
  ElementsDefinition,
  NodeDefinition,
} from 'cytoscape';
import type { IDirectory, IFile } from '@/app/api/fs/types/index';

/**
 * Builds a weighted dependency graph based on package-level imports.
 * - Adds intrinsic directory nodes (from folder structure)
 * - Aggregates edges (source pkg -> target pkg) with cumulative weight
 * - Adds vendor nodes for any edge endpoints not present as intrinsic nodes
 * - Sanitizes: skips empty package ids and self-edges
 */
export function buildGraph(dir: IDirectory) {
  /**
   * Build graph (nodes/edges) recursively
   */
  function buildGraphRecursively(
    currentDir: IDirectory,
    currentPath = '',
    nodes: NodeDefinition[] = [],
    edges: Map<string, EdgeDefinition> = new Map()
  ) {
    Object.keys(currentDir).forEach(key => {
      const dirOrFile = (currentDir as Record<string, IDirectory | IFile>)[key];
      const isDirectory = !(dirOrFile as IFile)?.className;

      // 1) Add directory as a node
      if (isDirectory) {
        const pkg = currentPath ? `${currentPath}.${key}` : key;
        console.log('pkg,currentDir,currentPath,key', pkg, currentDir, currentPath, key);

        nodes.push({
          data: { id: pkg, path: pkg, parent: currentPath, label: key, isIntrinsic: true },
          group: 'nodes',
        });

        // Recurse into subdirectories
        return buildGraphRecursively(dirOrFile as IDirectory, pkg, nodes, edges);
      }

      // 2) Aggregate file imports as weighted package edges (package perspective)
      const file = dirOrFile as IFile;
      const source = file.package?.trim();
      if (!source) return; // skip empty/default package ids

      const targets = (file.imports ?? [])
        .map(imp => imp.pkg?.trim())
        .filter((t): t is string => !!t);

      targets.forEach(target => {
        if (target === source) return; // skip self-edges at package level

        const edgeId = `${source}->${target}`;
        const existing = edges.get(edgeId);
        const prev = (existing?.data as EdgeDataDefinitionWithWeight | undefined)?.weight ?? 0;
        const weight: EdgeDataDefinitionWithWeight['weight'] = prev + 1;

        const data: EdgeDataDefinitionWithWeight = { source, target, weight };
        edges.set(edgeId, { data, group: 'edges' });
      });
    });

    return { nodes, edges };
  }

  const rawElements: ElementsDefinitionWithEdgeMap = buildGraphRecursively(dir);

  // Add vendor packages (edge source/target not already in 'nodes')
  rawElements.edges.forEach(({ data: { source, target } }) => {
    [source, target].forEach(maybeNode => {
      const id = String(maybeNode ?? '').trim();
      if (!id) return; // don't create a node with empty id

      // Node already defined while handling intrinsic directories
      if (rawElements.nodes.find(node => node.data.id === id)) return;

      // Grab the eventual parent for compound nodes
      const parent = id.includes('.') ? id.split('.').slice(0, -1).join('.') : '';

      // Add vendor node: 'isIntrinsic' is not set (vendor package)
      rawElements.nodes.push({
        data: { id: parent ? id.split('.').pop() : id, label: id, path: id, parent },
        group: 'nodes',
      });
    });
  });

  // Convert edges from Map (values) to EdgeDefinition[]
  const elements: ElementsDefinition = {
    nodes: rawElements.nodes,
    edges: Array.from(rawElements.edges.values()),
  };

  return elements;
}

interface EdgeDataDefinitionWithWeight extends EdgeDataDefinition {
  weight: number;
}
interface ElementsDefinitionWithEdgeMap {
  readonly nodes: NodeDefinition[];
  readonly edges: Map<string, EdgeDefinition>;
}
