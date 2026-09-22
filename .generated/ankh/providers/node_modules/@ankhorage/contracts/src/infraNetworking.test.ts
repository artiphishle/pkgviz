import { describe, expect, it } from 'bun:test';

import { type InfraEnvironmentSpec, isInfraEnvironmentSpec } from './infra';

const local = {
  deployment: { compute: { provider: 'local' }, runtime: { provider: 'minikube' } },
} as const satisfies InfraEnvironmentSpec;

describe('Infra networking configuration', () => {
  it('accepts matching HTTPS ACME intent', () => {
    expect(
      isInfraEnvironmentSpec({
        ...local,
        networking: {
          domain: 'api.example.ch',
          publicBaseUrl: 'https://api.example.ch',
          tls: { mode: 'acme-http-01', contactEmail: 'infra@example.ch' },
        },
      }),
    ).toBe(true);
  });

  it.each([
    { domain: 'example.ch', cdn: true },
    { publicBaseUrl: 'ftp://api.example.ch' },
    { publicBaseUrl: 'https://api.example.ch/auth/v1' },
    { publicBaseUrl: 'https://api.example.ch/' },
    { tls: { mode: 'acme-http-01', contactEmail: 'infra@example.ch' } },
    {
      domain: 'api.example.ch',
      publicBaseUrl: 'http://api.example.ch',
      tls: { mode: 'acme-http-01', contactEmail: 'infra@example.ch' },
    },
    {
      domain: 'api.example.ch',
      publicBaseUrl: 'https://other.example.ch',
      tls: { mode: 'acme-http-01', contactEmail: 'infra@example.ch' },
    },
    {
      domain: 'api.example.ch',
      publicBaseUrl: 'https://api.example.ch',
      tls: { mode: 'manual', contactEmail: 'infra@example.ch' },
    },
    {
      domain: 'api.example.ch',
      publicBaseUrl: 'https://api.example.ch',
      tls: { mode: 'acme-http-01', contactEmail: '' },
    },
  ])('rejects malformed networking intent: %j', (networking) => {
    expect(isInfraEnvironmentSpec({ ...local, networking })).toBe(false);
  });
});
