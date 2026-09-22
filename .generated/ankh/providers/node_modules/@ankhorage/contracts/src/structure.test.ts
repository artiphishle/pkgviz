import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { expect, test } from 'bun:test';

import {
  type EntityRegistry,
  isStructureDescriptor,
  isStructureDescriptorDocument,
  type SerializableSet,
  type StructureDescriptorDocument,
  type ValueMap,
} from './structure';

test('exports canonical structural collection markers from the structure boundary', () => {
  const registry = { theme: { id: 'theme' } } satisfies EntityRegistry<
    string,
    { readonly id: string },
    'id'
  >;
  const values = { spacing: 8 } satisfies ValueMap<string, number>;
  const membership = { camera: true } satisfies SerializableSet<'camera' | 'microphone'>;

  expect(registry.theme.id).toBe('theme');
  expect(values.spacing).toBe(8);
  expect(membership.camera).toBe(true);
});

test('accepts scalar, enum and object descriptors', () => {
  expect(isStructureDescriptor({ kind: 'scalar', type: 'string' })).toBe(true);
  expect(isStructureDescriptor({ kind: 'enum', values: ['light', 'dark'] })).toBe(true);
  expect(
    isStructureDescriptor({
      kind: 'object',
      fields: {
        name: { value: { kind: 'scalar', type: 'string' } },
        enabled: { value: { kind: 'scalar', type: 'boolean' }, optional: true },
      },
    }),
  ).toBe(true);
});

test('accepts registry, map, set and ordered-list descriptors', () => {
  expect(
    isStructureDescriptor({
      kind: 'entity-registry',
      key: { kind: 'scalar', type: 'string' },
      value: { kind: 'ref', id: 'theme' },
      identityField: 'id',
    }),
  ).toBe(true);
  expect(
    isStructureDescriptor({
      kind: 'value-map',
      key: { kind: 'scalar', type: 'string' },
      value: { kind: 'scalar', type: 'number' },
    }),
  ).toBe(true);
  expect(
    isStructureDescriptor({
      kind: 'set',
      member: { kind: 'enum', values: ['camera', 'microphone'] },
    }),
  ).toBe(true);
  expect(
    isStructureDescriptor({
      kind: 'ordered-list',
      item: { kind: 'scalar', type: 'string' },
    }),
  ).toBe(true);
});

test('accepts unions and references', () => {
  expect(
    isStructureDescriptor({
      kind: 'union',
      discriminator: 'kind',
      variants: [
        { kind: 'ref', id: 'literal-source' },
        { kind: 'ref', id: 'state-source' },
      ],
    }),
  ).toBe(true);
  expect(
    isStructureDescriptor({
      kind: 'ref',
      packageName: '@ankhorage/example-owner',
      id: 'external-config',
    }),
  ).toBe(true);
});

test('rejects malformed scalar and union declarations', () => {
  expect(isStructureDescriptor({ kind: 'unknown' })).toBe(false);
  expect(isStructureDescriptor({ kind: 'enum', values: [] })).toBe(false);
  expect(isStructureDescriptor({ kind: 'enum', values: ['x', 'x'] })).toBe(false);
  expect(isStructureDescriptor({ kind: 'enum', values: [Number.NaN] })).toBe(false);
  expect(
    isStructureDescriptor({
      kind: 'union',
      variants: [{ kind: 'scalar', type: 'string' }],
    }),
  ).toBe(false);
});

test('rejects non-string map keys and set members', () => {
  expect(
    isStructureDescriptor({
      kind: 'value-map',
      key: { kind: 'scalar', type: 'number' },
      value: { kind: 'scalar', type: 'string' },
    }),
  ).toBe(false);
  expect(
    isStructureDescriptor({
      kind: 'set',
      member: { kind: 'scalar', type: 'boolean' },
    }),
  ).toBe(false);
});

test('rejects cyclic inline object graphs without overflowing', () => {
  const cyclic: Record<string, unknown> = {
    kind: 'object',
    fields: {},
  };
  cyclic.fields = {
    self: { value: cyclic },
  };

  expect(isStructureDescriptor(cyclic)).toBe(false);
});

test('accepts recursive local and package-qualified references', () => {
  expect(isStructureDescriptorDocument(STRUCTURE_DOCUMENT_FIXTURE)).toBe(true);
  expect(JSON.parse(JSON.stringify(STRUCTURE_DOCUMENT_FIXTURE))).toEqual(
    STRUCTURE_DOCUMENT_FIXTURE,
  );
});

test('rejects unresolved local roots and references', () => {
  expect(
    isStructureDescriptorDocument({
      ...STRUCTURE_DOCUMENT_FIXTURE,
      roots: { app: 'missing' },
    }),
  ).toBe(false);
  expect(
    isStructureDescriptorDocument({
      ...STRUCTURE_DOCUMENT_FIXTURE,
      descriptors: {
        ...STRUCTURE_DOCUMENT_FIXTURE.descriptors,
        app: {
          id: 'app',
          descriptor: { kind: 'ref', id: 'missing' },
        },
      },
    }),
  ).toBe(false);
});

test('rejects registry key and definition identity mismatches', () => {
  expect(
    isStructureDescriptorDocument({
      ...STRUCTURE_DOCUMENT_FIXTURE,
      descriptors: {
        ...STRUCTURE_DOCUMENT_FIXTURE.descriptors,
        app: {
          id: 'different-id',
          descriptor: { kind: 'scalar', type: 'string' },
        },
      },
    }),
  ).toBe(false);
});

test('proves referenced set members are strings', () => {
  expect(
    isStructureDescriptorDocument({
      ...STRUCTURE_DOCUMENT_FIXTURE,
      descriptors: {
        ...STRUCTURE_DOCUMENT_FIXTURE.descriptors,
        numeric: {
          id: 'numeric',
          descriptor: { kind: 'scalar', type: 'number' },
        },
        app: {
          id: 'app',
          descriptor: {
            kind: 'set',
            member: { kind: 'ref', id: 'numeric' },
          },
        },
      },
    }),
  ).toBe(false);
});

test('publishes the dedicated structure subpath', async () => {
  const packageJson = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8')) as {
    exports?: Readonly<Record<string, { default?: string; types?: string }>>;
  };
  const exports = new Map(Object.entries(packageJson.exports ?? {}));

  expect(exports.get('./structure')).toEqual({
    types: './dist/structure/index.d.ts',
    default: './dist/structure/index.js',
  });
});

const STRUCTURE_DOCUMENT_FIXTURE = {
  protocolVersion: 1,
  packageName: '@ankhorage/contracts',
  packageVersion: '0.0.0-test',
  roots: { app: 'app' },
  descriptors: {
    app: {
      id: 'app',
      descriptor: {
        kind: 'object',
        fields: {
          themes: {
            value: {
              kind: 'entity-registry',
              key: { kind: 'scalar', type: 'string' },
              value: { kind: 'ref', id: 'theme' },
              identityField: 'id',
            },
          },
          permissions: {
            optional: true,
            value: {
              kind: 'set',
              member: { kind: 'ref', id: 'permission-name' },
            },
          },
          external: {
            optional: true,
            value: {
              kind: 'ref',
              packageName: '@ankhorage/example-owner',
              id: 'external-config',
            },
          },
        },
      },
    },
    theme: {
      id: 'theme',
      descriptor: {
        kind: 'object',
        fields: {
          id: { value: { kind: 'scalar', type: 'string' } },
          children: {
            optional: true,
            value: {
              kind: 'ordered-list',
              item: { kind: 'ref', id: 'theme' },
            },
          },
        },
      },
    },
    'permission-name': {
      id: 'permission-name',
      descriptor: {
        kind: 'enum',
        values: ['camera', 'microphone'],
      },
    },
  },
} as const satisfies StructureDescriptorDocument;
