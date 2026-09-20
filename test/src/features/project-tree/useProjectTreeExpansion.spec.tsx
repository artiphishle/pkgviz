import { describe, expect, it, render } from '@artiphishle/testosterone';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

import { useProjectTreeExpansion } from '@/features/project-tree/adapters/inbound/react/useProjectTreeExpansion';
import type { ProjectTreeNode } from '@/types/projectTree';

const nodes: readonly ProjectTreeNode[] = [
  {
    id: 'root',
    label: 'root',
    graphPackage: 'root',
    kind: 'directory',
    children: [
      {
        id: 'nested',
        label: 'nested',
        graphPackage: 'root.nested',
        kind: 'directory',
        children: [{ id: 'file', label: 'file', kind: 'file', graphPackage: 'root.nested' }],
      },
    ],
  },
];

function Harness({ selectedId }: { selectedId: string }) {
  const expansion = useProjectTreeExpansion(nodes, selectedId);
  return (
    <button onClick={() => expansion.onExpandedChange([])}>
      {expansion.expandedIds.join('|')}
    </button>
  );
}

describe('[project tree navigation expansion]', () => {
  it('opens the target folder, permits manual collapse, and reopens on navigation back', async () => {
    const host = render(<div />);
    const root = createRoot(host.container);
    try {
      await act(async () => root.render(<Harness selectedId="nested" />));
      expect(host.container.textContent).toBe('root|nested');
      await act(async () => host.container.querySelector('button')?.click());
      expect(host.container.textContent).toBe('');
      await act(async () => root.render(<Harness selectedId="nested" />));
      expect(host.container.textContent).toBe('');
      await act(async () => root.render(<Harness selectedId="root" />));
      await act(async () => root.render(<Harness selectedId="nested" />));
      expect(host.container.textContent).toBe('root|nested');
    } finally {
      await act(async () => root.unmount());
      host.unmount();
    }
  });
});
