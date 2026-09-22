import { expect, it } from 'bun:test';

import { isInfraWorkloadSpec } from './infra';

const workload = {
  id: 'database',
  artifact: { kind: 'image', image: 'example/database:1' },
  persistence: {
    config: {
      id: 'config',
      mountPath: '/etc/database-custom',
      sizeGiB: 1,
      seed: 'image',
      retention: 'retain',
    },
  },
} as const;

it('accepts image-seeded persistence initialization', () => {
  expect(isInfraWorkloadSpec(workload)).toBe(true);
});

it('rejects unsupported persistence initialization modes', () => {
  expect(
    isInfraWorkloadSpec({
      ...workload,
      persistence: { config: { ...workload.persistence.config, seed: 'empty' } },
    }),
  ).toBe(false);
});
