import { describe, expect, it } from 'bun:test';

import type {
  AnkhCapabilityId,
  AnkhCommandDescriptor,
  AnkhCommandProviderManifest,
  AnkhPackageMetadata,
} from './index';

describe('cli contracts', () => {
  it('accepts provider package metadata and provider manifests', () => {
    const packageMetadata = {
      category: 'infra',
      provider: './dist/cli/index.js',
      capabilities: ['infra.up', 'infra.status'],
    } as const satisfies AnkhPackageMetadata;

    const upCommand = {
      path: ['up'],
      summary: 'Bring project infrastructure up',
      capability: 'infra.up',
      aliases: ['start'],
      examples: ['ankh infra up shop'],
    } as const satisfies AnkhCommandDescriptor;

    const manifest = {
      id: '@ankhorage/infra',
      category: 'infra',
      version: '1.0.0',
      capabilities: ['infra.up', 'infra.status'],
      commands: [upCommand],
    } as const satisfies AnkhCommandProviderManifest;

    expect(JSON.parse(JSON.stringify(packageMetadata))).toEqual(packageMetadata);
    expect(JSON.parse(JSON.stringify(manifest))).toEqual(manifest);
    expect(manifest.id).toBe('@ankhorage/infra');
    expect(manifest.category).toBe('infra');
    expect(manifest.commands[0].path).toEqual(['up']);
  });

  it('accepts an empty path as a category-root command', () => {
    const deployCommand = {
      path: [],
      summary: 'Deploy the authored release',
      capability: 'deploy.release',
      examples: ['ankh deploy'],
    } as const satisfies AnkhCommandDescriptor;

    const manifest = {
      id: '@ankhorage/deploy',
      category: 'deploy',
      version: '1.0.0',
      capabilities: ['deploy.release'],
      commands: [deployCommand],
    } as const satisfies AnkhCommandProviderManifest;

    expect(manifest.commands[0].path).toEqual([]);
    expect(JSON.parse(JSON.stringify(manifest))).toEqual(manifest);
  });

  it('accepts metadata-only packages without a provider module', () => {
    const packageMetadata = {
      category: 'contracts',
      provider: null,
      capabilities: ['contracts.cli'],
    } as const satisfies AnkhPackageMetadata;

    expect(JSON.parse(JSON.stringify(packageMetadata))).toEqual(packageMetadata);
    expect(packageMetadata.provider).toBeNull();
  });

  it('keeps command paths relative to the provider category', () => {
    const androidScanCommand = {
      path: ['android', 'scan'],
      summary: 'Scan an Android target',
      capability: 'dev.android.scan',
      examples: ['ankh dev android scan'],
    } as const satisfies AnkhCommandDescriptor;

    const manifest = {
      id: '@ankhorage/dev',
      category: 'dev',
      version: '1.0.0',
      capabilities: ['dev.android.scan'],
      commands: [androidScanCommand],
    } as const satisfies AnkhCommandProviderManifest;

    expect(manifest.category).toBe('dev');
    expect(manifest.commands[0].path).toEqual(['android', 'scan']);
    expect(manifest.commands[0].path[0]).not.toBe(manifest.category);
  });

  it('accepts dot-separated capability ids for discovery metadata', () => {
    const capabilities = [
      'infra.up',
      'templates.list',
      'board.web.import',
      'contracts.cli',
    ] as const satisfies readonly AnkhCapabilityId[];

    expect(capabilities).toEqual([
      'infra.up',
      'templates.list',
      'board.web.import',
      'contracts.cli',
    ]);
  });
});
