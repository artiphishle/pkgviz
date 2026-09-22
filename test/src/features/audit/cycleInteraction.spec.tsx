import { describe, expect, it, render } from '@artiphishle/testosterone';
import { ZoraProvider } from '@zora/ZoraProvider';
import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { CyclicDependenciesRuleDetails } from '@/features/audit/adapters/inbound/react/CyclicDependenciesRuleDetails';
import { getCycleId } from '@/features/audit/utils/cycleVisualization';
import type { CycleInspection } from '@/types/auditVisualization';

const cycle = { packages: ['a', 'b', 'a'], edges: [] };

function Harness() {
  const [inspection, setInspection] = useState<CycleInspection | null>(null);
  const [selected, setSelected] = useState(true);
  return (
    <>
      <CyclicDependenciesRuleDetails
        cycles={[cycle]}
        inspectedCycleId={inspection?.id ?? null}
        cycleSelection={{
          highlights: [],
          selectedIds: selected ? [getCycleId(cycle)] : [],
          setSelected: (_, value) => setSelected(value),
        }}
        onCycleInspectionChange={setInspection}
      />
      <output>{inspection?.label ?? 'closed'}</output>
    </>
  );
}

describe('[cycle interaction]', () => {
  it('keeps row inspection independent from the trailing cycle switch', async () => {
    const host = render(<div />);
    const previousForm = Object.getOwnPropertyDescriptor(globalThis, 'HTMLFormElement');
    Object.defineProperty(globalThis, 'HTMLFormElement', {
      configurable: true,
      value: window.HTMLFormElement,
    });
    const root = createRoot(host.container);
    try {
      await act(async () =>
        root.render(
          <ZoraProvider mode="light">
            <Harness />
          </ZoraProvider>
        )
      );
      const row = host.container.querySelector<HTMLElement>('[data-testid="cycle-row-0"]')!;
      const toggle = host.container.querySelector<HTMLElement>('[data-testid="cycle-switch-0"]')!;

      expect(row.textContent).toContain('C1: a → b → a');
      expect(toggle.getAttribute('aria-checked')).toBe('true');
      expect(host.container.querySelector('output')?.textContent).toBe('closed');

      await act(async () => toggle.click());
      expect(toggle.getAttribute('aria-checked')).toBe('false');
      expect(host.container.querySelector('output')?.textContent).toBe('closed');

      await act(async () => toggle.click());
      expect(toggle.getAttribute('aria-checked')).toBe('true');
      expect(host.container.querySelector('output')?.textContent).toBe('closed');

      await act(async () => row.click());
      expect(host.container.querySelector('output')?.textContent).toBe('Cycle 1');

      await act(async () => toggle.click());
      expect(toggle.getAttribute('aria-checked')).toBe('false');
      expect(host.container.querySelector('output')?.textContent).toBe('closed');
    } finally {
      await act(async () => root.unmount());
      host.unmount();
      if (previousForm) Object.defineProperty(globalThis, 'HTMLFormElement', previousForm);
      else Reflect.deleteProperty(globalThis, 'HTMLFormElement');
    }
  });
});
