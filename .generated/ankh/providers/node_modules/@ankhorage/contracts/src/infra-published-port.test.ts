import { describe, expect, it } from 'bun:test';

import { isInfraEnvironmentSpec, isInfraWorkloadSpec } from './infra';

const publicWorkload = {
  id: 'api',
  artifact: { kind: 'image', image: 'example/api:1' },
  ports: { http: { port: 8080, publishedPort: 18_080 } },
  exposure: 'public',
} as const;

describe('published workload ports', () => {
  it('accepts one exact external listener for a public workload', () => {
    expect(isInfraWorkloadSpec(publicWorkload)).toBe(true);
    expect(isInfraWorkloadSpec({ ...publicWorkload, replicas: 0 })).toBe(true);
    expect(isInfraWorkloadSpec({ ...publicWorkload, replicas: 1 })).toBe(true);
  });

  it.each([
    { ...publicWorkload, ports: { http: { port: 80, publishedPort: 0 } } },
    { ...publicWorkload, ports: { http: { port: 80, publishedPort: 65_536 } } },
    { ...publicWorkload, exposure: 'internal' },
    { ...publicWorkload, replicas: 2 },
    {
      ...publicWorkload,
      ports: {
        http: { port: 80, publishedPort: 8080 },
        admin: { port: 81, publishedPort: 8080 },
      },
    },
  ])('rejects an invalid fixed external listener: %j', (workload) => {
    expect(isInfraWorkloadSpec(workload)).toBe(false);
  });

  it('rejects external listener collisions across workloads', () => {
    expect(
      isInfraEnvironmentSpec({
        deployment: { compute: { provider: 'local' }, runtime: { provider: 'minikube' } },
        workloads: { api: publicWorkload, admin: { ...publicWorkload, id: 'admin' } },
      }),
    ).toBe(false);
  });
});
