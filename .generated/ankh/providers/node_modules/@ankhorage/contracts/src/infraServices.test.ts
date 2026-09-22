import { describe, expect, it } from 'bun:test';

import { type InfraEnvironmentSpec, isInfraEnvironmentSpec } from './infra';

const local = {
  deployment: { compute: { provider: 'local' }, runtime: { provider: 'minikube' } },
} as const satisfies InfraEnvironmentSpec;
const production = {
  deployment: {
    compute: { provider: 'hetzner', location: 'nbg1' },
    runtime: { provider: 'k3s', topology: { servers: 1, agents: 0 } },
  },
  database: { provider: 'supabase' },
  auth: { provider: 'supabase' },
  objectStorage: { provider: 'r2', buckets: { media: true } },
  authz: { provider: 'cerbos', kind: 'ABAC' },
  secretStore: { provider: 'supabase-vault' },
  networking: { domain: 'api.example.ch', publicBaseUrl: 'https://api.example.ch' },
} as const satisfies InfraEnvironmentSpec;

const invalidServiceSelections: Record<string, unknown>[] = [
  { database: { provider: 'postgres' } },
  { database: { provider: 'supabase', tier: 'enterprise' } },
  { objectStorage: { provider: 'auto' } },
  { objectStorage: { provider: 's3' } },
  { objectStorage: { provider: 'supabase', buckets: [1] } },
  { objectStorage: { provider: 'supabase', accountId: 'r2-account' } },
  { auth: { provider: 'custom' } },
  { auth: { provider: 'supabase', scope: 'unknown' } },
  { auth: { provider: 'supabase', authorization: { kind: 'ABAC', engine: 'cerbos' } } },
  { authz: { provider: 'native', kind: 'RBAC' } },
  { authz: { engine: 'cerbos', kind: 'ABAC' } },
  { authz: { provider: 'cerbos', kind: 'unknown' } },
  { secretStore: { provider: 'unknown' } },
  { secretStore: { provider: 'supabase-vault' } },
];

describe('sibling service configuration', () => {
  it('accepts Supabase auth, Cerbos and independent R2 storage', () => {
    expect(isInfraEnvironmentSpec(production)).toBe(true);
    expect(isInfraEnvironmentSpec({ ...production, objectStorage: { provider: 'supabase' } })).toBe(
      true,
    );
    expect(isInfraEnvironmentSpec({ ...local, auth: { provider: 'supabase' } })).toBe(true);
  });

  it.each(invalidServiceSelections)('rejects unsupported service selection: %j', (selection) => {
    expect(isInfraEnvironmentSpec({ ...local, ...selection })).toBe(false);
  });
});
