import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'bun:test';

import type { PressableProps } from '../features/pressable/public';
import type { InteractionPolicy, InteractionPolicyProps } from './interactionPolicy';

const indexSource = readFileSync(new URL('../index.ts', import.meta.url), 'utf8');

describe('InteractionPolicy ownership', () => {
  it('exports the policy types from the public root', () => {
    expect(indexSource).toContain(
      "export type { InteractionPolicy, InteractionPolicyProps } from './types/interactionPolicy';",
    );
  });

  it('keeps the allowed policy values explicit', () => {
    const enabled: InteractionPolicy = 'enabled';
    const passive: InteractionPolicy = 'passive';

    expect([enabled, passive]).toEqual(['enabled', 'passive']);
  });

  it('shares the owned policy contract with PressableProps', () => {
    const policyProps: InteractionPolicyProps = { interactionPolicy: 'passive' };
    const pressableProps: PressableProps = policyProps;

    expect(pressableProps.interactionPolicy).toBe('passive');
  });
});
