import { describe, expect, it, render } from '@artiphishle/testosterone';
import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';

import { useGraphInteractions } from '@/features/graph-view/adapters/inbound/react/useGraphInteractions';

describe('[useGraphInteractions]', () => {
  it('ignores compounds, restores selected leaves, and drops removed selection before reappearance', () => {
    const nodes = [{ id: 'p' }, { id: 'a', parentId: 'p' }, { id: 'b' }];
    const edges = [{ id: 'ab', source: 'a', target: 'b' }];
    const host = render(<div />);
    const root = createRoot(host.container);

    function Harness({ visibleNodes }: { visibleNodes: typeof nodes }) {
      const interaction = useGraphInteractions(visibleNodes, edges);
      return (
        <>
          <output>
            {interaction.nodes.map(node => `${node.id}:${node.classes ?? ''}`).join('|')}
          </output>
          <button onClick={() => interaction.handleNodeEvent({ id: 'p', type: 'select' })}>
            compound
          </button>
          <button onClick={() => interaction.handleNodeEvent({ id: 'a', type: 'select' })}>
            select
          </button>
          <button onClick={() => interaction.handleNodeEvent({ id: 'b', type: 'pointer-enter' })}>
            enter
          </button>
          <button onClick={() => interaction.handleNodeEvent({ id: 'b', type: 'pointer-leave' })}>
            leave
          </button>
        </>
      );
    }

    const show = (visibleNodes: typeof nodes) =>
      flushSync(() => root.render(<Harness visibleNodes={visibleNodes} />));
    const click = (label: string) =>
      flushSync(() => {
        const button = Array.from(host.container.querySelectorAll('button')).find(
          node => node.textContent === label
        );
        if (!button) throw new Error(`Missing ${label} button`);
        button.click();
      });
    const output = () => host.container.querySelector('output')?.textContent;
    try {
      show(nodes);
      click('compound');
      expect(output()).toBe('p:|a:|b:');
      click('select');
      expect(output()).toBe('p:hushed|a:highlight|b:highlight-outgoer');
      click('enter');
      expect(output()).toBe('p:hushed|a:highlight-incomer|b:highlight');
      click('leave');
      expect(output()).toBe('p:hushed|a:highlight|b:highlight-outgoer');
      show([{ id: 'b' }]);
      expect(output()).toBe('b:');
      show(nodes);
      expect(output()).toBe('p:|a:|b:');
    } finally {
      flushSync(() => root.unmount());
      host.unmount();
    }
  });
});
