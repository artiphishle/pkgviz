import { readOwnProperty } from '@ankhorage/utility/object';
import { describe, expect, it } from 'bun:test';

import { isAppManifest, parseAppManifest } from './appManifest';

function createManifest(): Record<string, unknown> {
  return {
    metadata: {
      name: 'Example',
      slug: 'example',
      version: '1.0.0',
      category: 'developer_tools',
      themeId: 'default',
    },
    themes: {
      default: {
        id: 'default',
        name: 'Default',
        light: { primaryColor: '#3366ff', harmony: 'analogous' },
        dark: { primaryColor: '#6699ff', harmony: 'analogous' },
      },
    },
    activeThemeId: 'default',
    activeThemeMode: 'light',
    splashScreen: {
      image: { mediaId: 'hero' },
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
      dark: { backgroundColor: '#000000' },
    },
    media: {
      assets: {
        hero: {
          id: 'hero',
          name: 'Hero image',
          kind: 'image',
          source: { kind: 'storage', bucket: 'media', path: 'studio/hero.webp' },
        },
      },
    },
    state: { provider: 'legend', persistence: false },
    infra: {
      environments: {
        local: {
          deployment: { compute: { provider: 'local' }, runtime: { provider: 'minikube' } },
          database: { provider: 'supabase', tier: 'dev' },
          objectStorage: { provider: 'supabase', buckets: { media: true } },
          networking: { domain: 'example.test' },
        },
      },
      apis: {
        nutrition: {
          id: 'nutrition',
          origin: 'external',
          protocol: 'rest',
          baseUrl: 'https://api.ankhorage.com/v1/nutrition',
          schemas: {
            Product: {
              type: 'object',
              required: ['id', 'name'],
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
              },
            },
          },
          endpoints: {
            products: {
              id: 'products',
              kind: 'http',
              path: '/products',
              operations: {
                'products.list': {
                  id: 'products.list',
                  endpointId: 'products',
                  protocol: 'http',
                  intent: 'read',
                  method: 'GET',
                  path: '/products',
                },
              },
            },
          },
        },
      },
      modules: {
        'expo-localization': { config: { defaultLocale: 'en' } },
      },
    },
    navigator: {
      type: 'stack',
      initialRouteName: 'home',
      routes: [
        {
          name: 'home',
          path: '/',
          screenId: 'home',
          showInPrimaryNavigation: true,
        },
      ],
    },
    screens: {
      home: {
        id: 'home',
        name: 'Home',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'title',
              type: 'Text',
              repeat: { source: { kind: 'state', path: 'items' }, itemAlias: 'item' },
            },
          ],
        },
        dataLoaders: [
          {
            kind: 'operation',
            id: 'load-products',
            operation: { apiId: 'nutrition', endpointId: 'products', operationId: 'products.list' },
          },
        ],
        requires: {
          permissions: { camera: true },
          capabilities: { barcodeScanner: true, ebookReader: true },
        },
      },
    },
    dataSources: {
      primary: {
        id: 'primary',
        kind: 'database',
        adapter: { id: 'primary-db', kind: 'database' },
        endpoints: {},
      },
    },
    dataBindings: {
      title: {
        componentId: 'title',
        props: { text: { source: { kind: 'state', path: 'title' } } },
        events: {
          press: [{ target: { kind: 'action', type: 'console' } }],
        },
      },
    },
    settings: {
      localization: { defaultLocale: 'en', locales: ['en', 'de'] },
    },
  };
}

describe('AppManifest runtime parsing', () => {
  it('accepts the canonical manifest including infra APIs', () => {
    const manifest = createManifest();

    expect(isAppManifest(manifest)).toBe(true);
    expect(parseAppManifest(manifest)).toEqual({ ok: true, manifest });
  });

  it('rejects raw splash screen image paths', () => {
    const manifest = createManifest();
    const splashScreen = manifest.splashScreen as Record<string, unknown>;
    splashScreen.image = './assets/splash.png';

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('accepts an optional GitHub repository configuration', () => {
    const manifest = createManifest();
    manifest.repository = {
      provider: 'github',
      owner: 'ankhorage',
      name: 'example',
      url: 'https://github.com/ankhorage/example',
      defaultBranch: 'main',
    };

    expect(parseAppManifest(manifest)).toEqual({ ok: true, manifest });
  });

  it('rejects malformed GitHub repository configurations', () => {
    const manifest = createManifest();
    manifest.repository = {
      provider: 'gitlab',
      owner: 'ankhorage',
      name: 'example',
      url: 'https://github.com/ankhorage/example',
      defaultBranch: 'main',
    };

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('rejects missing required top-level sections', () => {
    const manifest = createManifest();
    delete manifest.settings;

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('rejects malformed nested canonical structures', () => {
    const manifest = createManifest();
    const themes = manifest.themes as Record<string, unknown>;
    const theme = readOwnProperty<Record<string, unknown>>(themes, 'default');
    const light = theme?.light as Record<string, unknown>;
    light.harmony = 'not-a-harmony';

    expect(parseAppManifest(manifest)).toEqual({
      ok: false,
      message: 'Value is not a canonical AppManifest.',
    });
  });

  it('rejects API registries whose key disagrees with API id', () => {
    const manifest = createManifest();
    const infra = manifest.infra as Record<string, unknown>;
    const apis = infra.apis as Record<string, unknown>;
    const nutrition = readOwnProperty(apis, 'nutrition');
    apis.catalog = nutrition;
    delete apis.nutrition;

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('rejects generatedApis as removed parallel API state', () => {
    const manifest = createManifest();
    manifest.generatedApis = {};

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('rejects API-flavoured dataSources', () => {
    const manifest = createManifest();
    manifest.dataSources = {
      external: {
        id: 'external',
        kind: 'api',
        origin: 'external',
        protocol: 'rest',
        baseUrl: 'https://example.test',
        endpoints: {},
      },
    };

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('rejects old dataSourceId API binding references', () => {
    const manifest = createManifest();
    const screens = manifest.screens as Record<string, Record<string, unknown>>;
    const loaders = screens.home?.dataLoaders as Record<string, unknown>[];
    loaders[0] = {
      kind: 'operation',
      operation: { dataSourceId: 'nutrition', operationId: 'products.list' },
    };

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('rejects settings.apiBaseUrl as removed parallel API state', () => {
    const manifest = createManifest();
    const settings = manifest.settings as Record<string, unknown>;
    settings.apiBaseUrl = 'https://example.test/api';

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('rejects transient media URLs at the manifest boundary', () => {
    const manifest = createManifest();
    const media = manifest.media as Record<string, Record<string, Record<string, unknown>>>;
    media.assets.hero.source = { kind: 'url', url: 'blob:https://example.test/transient' };

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('rejects legacy infra plugin state', () => {
    const manifest = createManifest();
    const infra = manifest.infra as Record<string, unknown>;
    infra.plugins = ['legacy'];

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('rejects screen registries whose key disagrees with screen id', () => {
    const manifest = createManifest();
    const screens = manifest.screens as Record<string, unknown>;
    screens.other = screens.home;
    delete screens.home;

    expect(isAppManifest(manifest)).toBe(false);
  });

  it('rejects invalid data-binding source kinds', () => {
    const manifest = createManifest();
    const bindings = manifest.dataBindings as Record<string, Record<string, unknown>>;
    const props = bindings.title?.props as Record<string, Record<string, unknown>>;
    props.text = { source: { kind: 'provider-specific', path: 'title' } };

    expect(isAppManifest(manifest)).toBe(false);
  });
});
