import { isRecord } from '@ankhorage/utility/object';

import type { InfraAdapterDescriptor } from '../types/infraAdapters';
import { INFRA_ADAPTER_CATALOG } from './constants';
import { isInfraShape } from './isInfraShape';

/*** Installed adapters must match the canonical identity, capabilities, targets and config version exactly. */
export function isInfraAdapterDescriptor(value: unknown): value is InfraAdapterDescriptor {
  if (!isRecord(value)) return false;
  const entry = Object.values(INFRA_ADAPTER_CATALOG).find((candidate) => candidate.id === value.id);
  if (!entry) return false;
  return isInfraShape(value, {
    id: (id) => id === entry.id,
    package: (name) => name === entry.package,
    kind: (kind) => kind === entry.kind,
    configVersion: (version) => version === entry.configVersion,
    capabilities: (items) => matchesCatalogList(items, entry.capabilities),
    targets: (items) => matchesCatalogList(items, entry.targets),
    dependencies: (items) => matchesCatalogList(items, entry.dependencies),
    operations: (items) =>
      items === undefined ||
      (Array.isArray(items) &&
        new Set(items).size === items.length &&
        items.every((item: unknown) =>
          ['suspend', 'resume', 'generate', 'diagnostics'].some((operation) => operation === item),
        )),
  });
}

/*** Canonical descriptor lists are ordered so JSON discovery and conformance are deterministic. */
function matchesCatalogList(value: unknown, expected: readonly string[]): boolean {
  return (
    Array.isArray(value) &&
    value.length === expected.length &&
    value.every((item, index) => item === expected.at(index))
  );
}
