import { expect, test } from 'bun:test';

import type {
  CustomNavigatorRegistration,
  NavigatorCatalog,
  NavigatorGeneratedFile,
  NavigatorGenerationBindings,
  NavigatorGenerationResult,
  NavigatorPlan,
} from './navigator';

test('keeps generation bindings and plan output portable across package boundaries', () => {
  const bindings: NavigatorGenerationBindings = {
    screens: { home: { module: '@/screens/Home', exportName: 'Home' } },
    guards: {},
  };
  const file: NavigatorGeneratedFile = {
    path: 'src/app/index.tsx',
    contents: 'export default Home;',
  };
  const plan: NavigatorPlan = {
    context: { platform: 'web', expoRouterVersion: '57.0.18' },
    root: {
      type: 'slot',
      pointer: '',
      adapter: {
        id: 'slot',
        module: 'expo-router',
        exportName: 'Slot',
        support: 'supported',
        stability: 'stable',
        limitations: [],
      },
      routes: [],
    },
    diagnostics: [],
    support: 'supported',
    capabilityIds: ['slot'],
    dependencies: [],
  };
  const result: NavigatorGenerationResult = {
    support: plan.support,
    capabilityIds: plan.capabilityIds,
    dependencies: plan.dependencies,
    diagnostics: plan.diagnostics,
    plan,
    files: [file],
  };
  expect(JSON.parse(JSON.stringify({ bindings, result }))).toEqual({ bindings, result });
});

test('separates capability taxonomy, target support, stability, and verification', () => {
  const catalog: NavigatorCatalog = {
    capabilities: [
      {
        id: 'tabs.headless.sidebar',
        topology: 'tabs',
        implementation: 'headless',
        presentation: 'sidebar',
        stability: 'stable',
        targets: [
          {
            platform: 'web',
            support: 'supported',
            verification: [{ kind: 'browser', status: 'verified' }],
          },
          {
            platform: 'ios',
            support: 'testing-only',
            verification: [{ kind: 'device', status: 'unverified' }],
          },
        ],
        dependencies: [],
        requirements: [],
        incompatibilities: [],
        limitations: [],
      },
    ],
    presets: [
      {
        id: 'drawer',
        description: 'Drawer as the root navigator with direct routes.',
        topology: ['drawer'],
      },
    ],
  };

  expect(catalog.capabilities[0]?.targets[1]?.support).toBe('testing-only');
  expect(catalog.presets[0]?.topology).toEqual(['drawer']);
});

test('describes a custom extension without importing Navigator or a UI runtime', () => {
  const registration: CustomNavigatorRegistration = {
    id: 'example',
    platforms: ['web'],
    stability: 'stable',
    integration: 'expo-router-standard',
    router: 'stack',
    module: '@example/navigation',
    exportName: 'ExampleNavigator',
    validateConfig: () => [],
  };
  expect(registration.validateConfig({ mode: 'compact' })).toEqual([]);
});
