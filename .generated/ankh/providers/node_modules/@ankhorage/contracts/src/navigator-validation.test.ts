import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { describe, expect, it } from 'bun:test';

import { isAppNavigatorManifest } from './appManifest/screens';
import type {
  CustomNavigatorNode,
  HeadlessTabsConfig,
  NavigatorNode,
  StackImplementationConfig,
} from './navigator';

describe('app navigator manifest type discrimination', () => {
  it('prevents incompatible options and non-serializable configuration at compile time', () => {
    // @ts-expect-error Slot does not own an arbitrary options bag.
    const slot: NavigatorNode = { type: 'slot', options: { arbitrary: true }, routes: [] };
    // @ts-expect-error Experimental Stack has no presentation options.
    const experimental: StackImplementationConfig = {
      implementation: 'experimental',
      options: { presentation: 'modal' },
    };
    // @ts-expect-error Fixed headless tabs do not accept a registered custom presentation id.
    const tabs: HeadlessTabsConfig = {
      implementation: 'headless',
      presentation: 'sidebar',
      customPresentationId: 'workspace-tabs',
    };
    // @ts-expect-error Custom navigator configuration must be serializable manifest values.
    const custom: CustomNavigatorNode = {
      type: 'custom',
      navigatorId: 'workspace',
      config: { callback: () => undefined },
      routes: [],
    };

    expect([slot, experimental, tabs, custom]).toHaveLength(4);
  });
});

describe('app navigator manifest stack validation', () => {
  it('rejects the removed untyped options bag and unsupported stack branch fields', () => {
    expect(isAppNavigatorManifest({ type: 'slot', options: { arbitrary: true }, routes: [] })).toBe(
      false,
    );
    expect(
      isAppNavigatorManifest({
        type: 'stack',
        implementation: 'experimental',
        options: { presentation: 'modal' },
        routes: [],
      }),
    ).toBe(false);
    expect(
      isAppNavigatorManifest({
        type: 'stack',
        implementation: 'javascript',
        options: { presentation: 'formSheet' },
        routes: [],
      }),
    ).toBe(false);
    expect(
      isAppNavigatorManifest({
        type: 'stack',
        implementation: 'native',
        minimizeBehavior: 'never',
        routes: [],
      }),
    ).toBe(false);
  });
});

describe('app navigator manifest removed fields', () => {
  it('rejects flow metadata and the superseded custom Tabs implementation', () => {
    expect(
      isAppNavigatorManifest({
        type: 'stack',
        flows: { onboarding: true },
        routes: [],
      }),
    ).toBe(false);
    expect(
      isAppNavigatorManifest({
        type: 'tabs',
        implementation: 'custom',
        presentation: 'bottom',
        routes: [],
      }),
    ).toBe(false);
    expect(
      isAppNavigatorManifest({
        type: 'stack',
        preset: 'root-stack-tabs',
        routes: [],
      }),
    ).toBe(false);
  });
});

describe('app navigator manifest sheet validation', () => {
  it('validates native form-sheet detents and their presentation discriminant', () => {
    for (const sheetAllowedDetents of [[], [0.8, 0.4], [0.4, 0.4], [0], [1.1], [Number.NaN]]) {
      expect(
        isAppNavigatorManifest({
          type: 'stack',
          options: { presentation: 'formSheet', sheetAllowedDetents },
          routes: [],
        }),
      ).toBe(false);
    }
    expect(
      isAppNavigatorManifest({
        type: 'stack',
        options: { presentation: 'modal', sheetGrabberVisible: true },
        routes: [],
      }),
    ).toBe(false);
    expect(
      isAppNavigatorManifest({
        type: 'stack',
        routes: [
          {
            name: 'compose',
            stackOptions: {
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents',
            },
          },
        ],
      }),
    ).toBe(true);
  });
});

describe('app navigator manifest custom validation', () => {
  it('rejects non-JSON and cyclic custom navigator configuration', () => {
    const cyclicConfig: Record<string, unknown> = {};
    cyclicConfig.self = cyclicConfig;

    for (const invalidConfig of [
      { callback: () => undefined },
      { token: Symbol('token') },
      { count: Number.NaN },
      { count: Number.POSITIVE_INFINITY },
      cyclicConfig,
    ]) {
      expect(
        isAppNavigatorManifest({
          type: 'custom',
          navigatorId: 'workspace',
          config: invalidConfig,
          routes: [],
        }),
      ).toBe(false);
    }
  });

  it('rejects incomplete Split View bindings', () => {
    expect(
      isAppNavigatorManifest({
        type: 'split-view',
        columns: {},
        routes: [],
      }),
    ).toBe(false);
  });
});

describe('app navigator manifest package boundary', () => {
  it('publishes the focused navigator contract subpath', async () => {
    const packageJson = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8')) as {
      exports?: Record<string, { default?: string; types?: string }>;
    };

    expect(packageJson.exports?.['./navigator']).toEqual({
      types: './dist/navigator.d.ts',
      default: './dist/navigator.js',
    });
  });
});
