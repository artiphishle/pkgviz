import { describe, expect, it } from '@artiphishle/testosterone';

import { getProjectTreeAncestorIds } from '@/features/project-tree/utils/getProjectTreeAncestorIds';
import type { ProjectTreeNode } from '@/types/projectTree';

describe('[getProjectTreeAncestorIds]', () => {
  it('returns the directory chain needed to reveal a nested selection', () => {
    const nodes: readonly ProjectTreeNode[] = [
      {
        id: 'directory:src',
        kind: 'directory',
        label: 'src',
        graphPackage: 'src',
        children: [
          {
            id: 'directory:src/components',
            kind: 'directory',
            label: 'components',
            graphPackage: 'src.components',
            children: [
              {
                id: 'file:src/components/Button.tsx',
                kind: 'file',
                label: 'Button.tsx',
                graphPackage: 'src.components',
              },
            ],
          },
        ],
      },
    ];

    expect(getProjectTreeAncestorIds(nodes, 'file:src/components/Button.tsx')).toEqual([
      'directory:src',
      'directory:src/components',
    ]);
  });

  it('returns an empty path for a missing node', () => {
    expect(getProjectTreeAncestorIds([], 'missing')).toEqual([]);
  });
});
