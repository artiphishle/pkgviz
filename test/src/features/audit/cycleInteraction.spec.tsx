import { describe, expect, it, render } from '@artiphishle/testosterone';
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
  it('toggles inspection independently and closes it when its highlight is disabled', async () => {
    const host = render(<div />);
    const previousForm = Object.getOwnPropertyDescriptor(globalThis, 'HTMLFormElement');
    Object.defineProperty(globalThis, 'HTMLFormElement', {
      configurable: true,
      value: window.HTMLFormElement,
    });
    const root = createRoot(host.container);
    try {
      await act(async () => root.render(<Harness />));
      const row = host.container.querySelector<HTMLButtonElement>('button[aria-expanded]')!;
      const toggle = host.container.querySelector<HTMLButtonElement>('button[role="switch"]')!;
      expect(row.className.includes('cursor-pointer')).toBe(true);
      expect(toggle.querySelector('[aria-hidden="true"]')?.getAttribute('style')).toContain(
        'background-color'
      );
      await act(async () => row.click());
      expect(row.getAttribute('aria-expanded')).toBe('true');
      expect(host.container.querySelector('output')?.textContent).toBe('Cycle 1');
      await act(async () => row.click());
      expect(host.container.querySelector('output')?.textContent).toBe('closed');
      expect(toggle.getAttribute('aria-checked')).toBe('true');
      await act(async () => row.click());
      await act(async () => toggle.click());
      expect(host.container.querySelector('output')?.textContent).toBe('closed');
      expect(toggle.getAttribute('aria-checked')).toBe('false');
    } finally {
      await act(async () => root.unmount());
      host.unmount();
      if (previousForm) Object.defineProperty(globalThis, 'HTMLFormElement', previousForm);
      else Reflect.deleteProperty(globalThis, 'HTMLFormElement');
    }
  });
});
