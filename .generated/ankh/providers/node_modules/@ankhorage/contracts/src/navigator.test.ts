import { describe, expect, it } from 'bun:test';

import {
  type AppNavigatorManifest,
  isAppNavigatorManifest,
  NAVIGATOR_PRESETS,
  NAVIGATOR_TYPES,
  type NavigatorNode,
  type StackImplementationConfig,
  type TabsNavigatorConfig,
} from './navigator';

function parseNavigator(value: unknown): AppNavigatorManifest {
  if (!isAppNavigatorManifest(value)) throw new Error('Expected a navigator manifest.');
  return value;
}

function createAdaptiveTabs(): AppNavigatorManifest {
  return {
    type: 'tabs',
    preset: 'tabs-stack',
    implementation: 'adaptive',
    web: {
      presentation: 'responsive',
      responsive: {
        compact: 'bottom',
        medium: 'rail',
        expanded: 'sidebar',
      },
    },
    routes: [{ name: 'home', path: '/', screenId: 'home' }],
  };
}

const VALID_NAVIGATOR_NODES = [
  { type: 'slot', routes: [] },
  {
    type: 'stack',
    implementation: 'native',
    options: {
      presentation: 'formSheet',
      sheetAllowedDetents: [0.4, 0.8],
      sheetGrabberVisible: true,
    },
    routes: [],
  },
  {
    type: 'stack',
    implementation: 'javascript',
    options: { presentation: 'transparentModal', headerShown: false },
    routes: [],
  },
  {
    type: 'stack',
    implementation: 'experimental',
    options: { title: 'Profile', headerTransparent: true },
    routes: [],
  },
  {
    type: 'tabs',
    implementation: 'native',
    minimizeBehavior: 'onScrollDown',
    bottomAccessory: { screenId: 'now-playing' },
    routes: [],
  },
  {
    type: 'drawer',
    options: { drawerPosition: 'right', drawerType: 'permanent', swipeEnabled: false },
    routes: [],
  },
  {
    type: 'split-view',
    columns: {
      primary: { screenId: 'sidebar' },
      supplementary: { screenId: 'inspector-list' },
    },
    inspector: { screenId: 'inspector' },
    topColumnForCollapsing: 'secondary',
    routes: [{ name: 'detail', screenId: 'detail' }],
  },
  {
    type: 'custom',
    navigatorId: 'workspace',
    config: { animation: 'spring', thresholds: [0.25, 0.75], enabled: true },
    routes: [],
  },
] as const satisfies readonly NavigatorNode[];

it('narrows unknown input through the public navigator boundary', () => {
  const manifest = parseNavigator({ type: 'drawer', routes: [] });

  expect(manifest.type).toBe('drawer');
});

describe('app navigator manifest topology', () => {
  it('keeps canonical topology presets finite and authorable', () => {
    expect(NAVIGATOR_TYPES).toEqual(['slot', 'stack', 'tabs', 'drawer', 'split-view', 'custom']);
    expect(NAVIGATOR_PRESETS).toEqual([
      'slot',
      'stack',
      'tabs',
      'tabs-stack',
      'stack-tabs',
      'stack-tabs-stack',
      'drawer',
      'drawer-stack',
      'stack-drawer',
      'stack-drawer-stack',
      'drawer-tabs',
      'drawer-tabs-stack',
      'stack-drawer-tabs',
      'stack-drawer-tabs-stack',
      'split-view',
      'custom',
    ]);
  });

  it('accepts adaptive native/Web tabs with responsive custom presentation', () => {
    expect(isAppNavigatorManifest(createAdaptiveTabs())).toBe(true);
  });

  it('accepts SVG media icon references without a provider', () => {
    const navigator = createAdaptiveTabs();
    navigator.routes[0] = {
      ...navigator.routes[0],
      icon: { source: { mediaId: 'navigation-home' } },
    };

    expect(isAppNavigatorManifest(navigator)).toBe(true);
  });

  it('rejects icon definitions that mix named and media sources', () => {
    const navigator = createAdaptiveTabs();
    navigator.routes[0] = {
      ...navigator.routes[0],
      icon: {
        name: 'home-outline',
        source: { mediaId: 'navigation-home' },
      } as never,
    };

    expect(isAppNavigatorManifest(navigator)).toBe(false);
  });

  it('treats omitted tabs implementation as the canonical adaptive default', () => {
    const tabs: TabsNavigatorConfig = { type: 'tabs' };
    const navigator: AppNavigatorManifest = { ...tabs, routes: [] };

    expect(isAppNavigatorManifest(navigator)).toBe(true);
  });
});

describe('app navigator manifest node variants', () => {
  it('accepts every typed navigator node variant', () => {
    expect(VALID_NAVIGATOR_NODES.every(isAppNavigatorManifest)).toBe(true);
  });

  it('accepts stack defaults and per-platform implementation overrides', () => {
    const experimental = {
      implementation: 'experimental',
      options: { headerShown: false },
    } as const satisfies StackImplementationConfig;

    expect(
      isAppNavigatorManifest({
        type: 'stack',
        routes: [],
        defaults: { stack: { implementation: 'native' } },
        platforms: {
          ios: { stack: experimental },
          web: { stack: { implementation: 'javascript', options: { presentation: 'card' } } },
        },
      }),
    ).toBe(true);
  });
});

describe('app navigator manifest headless presentation', () => {
  it('accepts fixed and registered custom Web presentations', () => {
    expect(
      isAppNavigatorManifest({
        type: 'tabs',
        implementation: 'headless',
        presentation: 'sidebar',
        routes: [],
      }),
    ).toBe(true);

    expect(
      isAppNavigatorManifest({
        type: 'tabs',
        implementation: 'headless',
        presentation: 'custom',
        customPresentationId: 'workspace-tabs',
        routes: [],
      }),
    ).toBe(true);
  });

  it('rejects incomplete responsive and custom presentation configuration', () => {
    expect(
      isAppNavigatorManifest({
        type: 'tabs',
        implementation: 'headless',
        presentation: 'responsive',
        routes: [],
      }),
    ).toBe(false);

    expect(
      isAppNavigatorManifest({
        type: 'tabs',
        implementation: 'headless',
        presentation: 'custom',
        routes: [],
      }),
    ).toBe(false);
  });
});

describe('app navigator manifest tabs branch validation', () => {
  it('rejects fields from incompatible tab branches', () => {
    expect(
      isAppNavigatorManifest({
        type: 'tabs',
        implementation: 'native',
        presentation: 'bottom',
        routes: [],
      }),
    ).toBe(false);

    expect(
      isAppNavigatorManifest({
        type: 'tabs',
        implementation: 'javascript',
        presentation: 'bottom',
        native: { implementation: 'native' },
        routes: [],
      }),
    ).toBe(false);

    expect(
      isAppNavigatorManifest({
        type: 'tabs',
        implementation: 'headless',
        presentation: 'sidebar',
        customPresentationId: 'must-not-apply',
        routes: [],
      }),
    ).toBe(false);

    expect(
      isAppNavigatorManifest({
        type: 'tabs',
        implementation: 'headless',
        presentation: 'custom',
        customPresentationId: 'workspace-tabs',
        responsive: { compact: 'bottom', expanded: 'sidebar' },
        routes: [],
      }),
    ).toBe(false);
  });
});

describe('app navigator manifest composition', () => {
  it('expresses app-owned sequences as ordinary guarded navigator branches', () => {
    expect(
      isAppNavigatorManifest({
        type: 'stack',
        routes: [
          {
            name: 'entry',
            navigator: {
              type: 'stack',
              routes: [{ name: 'step', screenId: 'step' }],
            },
          },
          {
            name: 'main',
            guards: ['entry-complete'],
            navigator: {
              type: 'tabs',
              routes: [{ name: 'home', screenId: 'home' }],
            },
          },
        ],
      }),
    ).toBe(true);
  });
});

describe('app navigator manifest route metadata', () => {
  it('preserves authored route names, labels, paths, guards, and visibility without inference', () => {
    const navigator = {
      type: 'stack',
      routes: [
        {
          name: '(app)',
          label: 'Application',
          guards: ['authenticated'],
          showInPrimaryNavigation: false,
          navigator: {
            type: 'tabs',
            routes: [{ name: 'learn', path: '/learn', label: 'Train', screenId: 'learn' }],
          },
        },
      ],
    } as const satisfies AppNavigatorManifest;

    expect(isAppNavigatorManifest(navigator)).toBe(true);
    expect(JSON.parse(JSON.stringify(navigator))).toEqual(navigator);
    expect(navigator.routes[0].navigator.routes[0]).toEqual({
      name: 'learn',
      path: '/learn',
      label: 'Train',
      screenId: 'learn',
    });
  });
});
