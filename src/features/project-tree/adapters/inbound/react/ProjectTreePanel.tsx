'use client';
import { type TreeItemNode, TreeView } from '@zora/tree-view';
import { FileCode2Icon, FolderIcon } from 'lucide-react';
import React from 'react';

import { findProjectTreeNode } from '@/features/project-tree/utils/findProjectTreeNode';
import { getProjectTreeAncestorIds } from '@/features/project-tree/utils/getProjectTreeAncestorIds';
import type { ProjectTreeNode } from '@/types/projectTree';

/*** Adapts PKGViz's serializable project tree to the generated ZORA browser TreeView. */
export function ProjectTreePanel({ nodes, onSelect, selectedId }: ProjectTreePanelProps) {
  const treeNodes = React.useMemo(() => nodes.map(toTreeItemNode), [nodes]);
  const [expandedIds, setExpandedIds] = React.useState<readonly string[]>([]);

  React.useEffect(() => {
    setExpandedIds(nodes.filter(node => node.kind === 'directory').map(node => node.id));
  }, [nodes]);

  React.useEffect(() => {
    if (selectedId === null) return;
    const ancestorIds = getProjectTreeAncestorIds(nodes, selectedId);
    setExpandedIds(currentIds => [...new Set([...currentIds, ...ancestorIds])]);
  }, [nodes, selectedId]);

  return (
    <div className="px-2 pt-2 text-xs">
      <TreeView
        ariaLabel="Project tree"
        expandedIds={expandedIds}
        nodes={treeNodes}
        selectedId={selectedId ?? undefined}
        onExpandedChange={setExpandedIds}
        onSelect={id => {
          const node = findProjectTreeNode(nodes, id);
          if (node) onSelect(node);
        }}
      />
    </div>
  );
}

/*** Maps a portable project-tree node into the ZORA TreeView presentation contract. */
function toTreeItemNode(node: ProjectTreeNode): TreeItemNode {
  return {
    id: node.id,
    label: node.label,
    icon:
      node.kind === 'directory' ? (
        <FolderIcon aria-hidden size={14} />
      ) : (
        <FileCode2Icon aria-hidden size={14} />
      ),
    ...(node.children ? { children: node.children.map(toTreeItemNode) } : {}),
  };
}

interface ProjectTreePanelProps {
  readonly nodes: readonly ProjectTreeNode[];
  readonly onSelect: (node: ProjectTreeNode) => void;
  readonly selectedId: string | null;
}
