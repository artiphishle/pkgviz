'use client';
import { Icon } from '@zora/icon';
import { type TreeItemNode, TreeView } from '@zora/tree-view';
import { View } from '@zora/view';
import React from 'react';

import { findProjectTreeNode } from '@/features/project-tree/utils/findProjectTreeNode';
import { getProjectTreeAncestorIds } from '@/features/project-tree/utils/getProjectTreeAncestorIds';
import type { ProjectTreeNode } from '@/types/projectTree';
import type { ZoraMode } from '@/types/zora';

/*** Adapts PKGViz's serializable project tree to the generated ZORA browser TreeView. */
export function ProjectTreePanel({ mode, nodes, onSelect, selectedId }: ProjectTreePanelProps) {
  const treeNodes = React.useMemo(() => nodes.map(node => toTreeItemNode(node, mode)), [mode, nodes]);
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
    <View mode={mode} p="s">
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
    </View>
  );
}

/*** Maps a portable project-tree node into the ZORA TreeView presentation contract. */
function toTreeItemNode(node: ProjectTreeNode, mode: ZoraMode): TreeItemNode {
  return {
    id: node.id,
    label: node.label,
    icon: (
      <Icon
        mode={mode}
        name={node.kind === 'directory' ? 'folder-outline' : 'document-text-outline'}
        size={14}
      />
    ),
    ...(node.children ? { children: node.children.map(child => toTreeItemNode(child, mode)) } : {}),
  };
}

interface ProjectTreePanelProps {
  readonly mode: ZoraMode;
  readonly nodes: readonly ProjectTreeNode[];
  readonly onSelect: (node: ProjectTreeNode) => void;
  readonly selectedId: string | null;
}
