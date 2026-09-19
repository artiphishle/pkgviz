'use client';
import { type TreeItemNode, TreeView } from '@zora/tree-view';
import { FileCode2Icon, FolderIcon } from 'lucide-react';
import React from 'react';

import { findProjectTreeNode } from '@/features/project-tree/utils/findProjectTreeNode';
import type { ProjectTreeNode } from '@/types/projectTree';

/*** Adapts PKGViz's serializable project tree to the generated ZORA browser TreeView. */
export function ProjectTreePanel({ nodes, onSelect, selectedId }: ProjectTreePanelProps) {
  const treeNodes = React.useMemo(() => nodes.map(toTreeItemNode), [nodes]);
  const defaultExpandedIds = React.useMemo(
    () => nodes.filter(node => node.kind === 'directory').map(node => node.id),
    [nodes]
  );

  return (
    <div className="px-2 pt-2 text-xs">
      <TreeView
        ariaLabel="Project tree"
        defaultExpandedIds={defaultExpandedIds}
        nodes={treeNodes}
        selectedId={selectedId ?? undefined}
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
