import { expect, it } from 'bun:test';

import { isInfraEnvironmentSpec } from './infra';

const deployment = {
  compute: { provider: 'local' },
  runtime: { provider: 'minikube' },
} as const;
const credentials = { source: 'control-plane', name: 'S3_PERSISTENCE' } as const;
const target = {
  endpoint: 'https://s3.example.com',
  region: 'eu-central-1',
  bucket: 'ankhorage-backups',
  credentials,
  forcePathStyle: true,
} as const;

function environment(overrides: Readonly<Record<string, unknown>> = {}): unknown {
  return { deployment, ...overrides };
}

it('accepts scheduled database backups and an S3-backed Supabase storage service', () => {
  expect(
    isInfraEnvironmentSpec(
      environment({
        database: {
          provider: 'supabase',
          tier: 'prod',
          backup: {
            mode: 'scheduled',
            target,
            intervalHours: 24,
          },
        },
        objectStorage: {
          provider: 'supabase',
          buckets: { media: true },
          backend: { ...target, bucket: 'ankhorage-storage' },
        },
      }),
    ),
  ).toBe(true);
});

it.each([
  { target: { ...target, endpoint: '/relative' } },
  { target: { ...target, region: '' } },
  { target: { ...target, bucket: '' } },
  { target: { ...target, credentials: { source: 'secret-store', name: 'S3' } } },
  { target, intervalHours: 0 },
  { target, intervalHours: 1.5 },
  { target, intervalHours: Number.NaN },
])('rejects malformed scheduled database backup intent: %j', (backup) => {
  expect(
    isInfraEnvironmentSpec(
      environment({
        database: {
          provider: 'supabase',
          backup: { mode: 'scheduled', ...backup },
        },
      }),
    ),
  ).toBe(false);
});

it('rejects the unsupported continuous database backup mode', () => {
  expect(
    isInfraEnvironmentSpec(
      environment({
        database: {
          provider: 'supabase',
          backup: { mode: 'continuous', target, baseBackupIntervalHours: 24 },
        },
      }),
    ),
  ).toBe(false);
});

it('rejects malformed S3-backed object storage configuration', () => {
  expect(
    isInfraEnvironmentSpec(
      environment({
        objectStorage: {
          provider: 'supabase',
          backend: { ...target, forcePathStyle: 'true' },
        },
      }),
    ),
  ).toBe(false);
});
