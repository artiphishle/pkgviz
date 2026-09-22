import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { COLOR_HARMONIES } from '@ankhorage/color-theory';
import { describe, expect, it } from 'bun:test';

import {
  type AnkhPackageMetadata,
  APP_CATEGORIES,
  type AppCategory,
  type AppManifest,
  type AppStateSpec,
  AUTH_SIGN_IN_IDENTIFIERS,
  AUTH_SIGN_UP_POLICIES,
  type AuthFlowConfig,
  type ButtonPressEventDto,
  type CollectionItemPressEventDto,
  type ComponentEventDto,
  type ComponentEventDtoKind,
  type DbAdapter,
  type DbAdminAdapter,
  type DbChangeEvent,
  type DbRealtimeAdapter,
  type FormSubmitEventDto,
  type ImageAssetSource,
  type InfraAuthSpec,
  type InfraManifest,
  NAVIGATOR_TYPES,
  type RouteDefinition,
  type StoragePublicUrlResult,
  type StorageResult,
  type StorageUploadResult,
  type ThemeConfig,
  type ThemeModeConfig,
} from './index';

async function collectTypeScriptFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTypeScriptFiles(path)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(path);
    }
  }

  return files;
}

describe('contracts', () => {
  it('exports the cli subpath for Ankh discovery contracts', async () => {
    const expectedAnkhMetadata = {
      category: 'contracts',
      provider: null,
      capabilities: ['contracts.cli'],
      structure: {
        output: 'src/structure/generated.ts',
        roots: {
          'screen-metadata': {
            source: 'src/types.ts',
            export: 'ScreenMetadataSpec',
          },
        },
      },
    } as const satisfies AnkhPackageMetadata;

    const packageJson = JSON.parse(await readFile(join(process.cwd(), 'package.json'), 'utf8')) as {
      ankh?: unknown;
      exports?: Record<string, { default?: string; types?: string }>;
    };

    expect(packageJson.exports?.['./cli']).toEqual({
      types: './dist/cli/index.d.ts',
      default: './dist/cli/index.js',
    });
    expect(packageJson.ankh).toEqual(expectedAnkhMetadata);
    expect(JSON.parse(JSON.stringify(expectedAnkhMetadata))).toEqual(expectedAnkhMetadata);
  });

  it('exports stable platform constants', () => {
    expect(NAVIGATOR_TYPES).toEqual(['slot', 'stack', 'tabs', 'drawer', 'split-view', 'custom']);
    expect(APP_CATEGORIES).toEqual([
      'books_reading',
      'business_productivity',
      'developer_tools',
      'education_learning',
      'entertainment_media',
      'finance_money',
      'food_drink',
      'games',
      'graphics_design',
      'health_fitness',
      'kids_family',
      'lifestyle',
      'medical',
      'music_audio',
      'navigation_travel',
      'news_magazines',
      'photo_video',
      'reference',
      'shopping_commerce',
      'social_community',
      'sports',
      'utilities_tools',
      'weather',
    ]);
  });

  it('exports the app category union for template packages', () => {
    const category: AppCategory = 'developer_tools';
    expect(category).toBe('developer_tools');
  });

  it('serializes canonical primary-navigation visibility on routes', () => {
    const visibleRoute: RouteDefinition = {
      name: 'home',
      path: '/',
      screenId: 'home-screen',
    };
    const hiddenRoute: RouteDefinition = {
      name: 'settings',
      path: '/settings',
      screenId: 'settings-screen',
      showInPrimaryNavigation: false,
    };

    expect(JSON.parse(JSON.stringify({ visibleRoute, hiddenRoute }))).toEqual({
      visibleRoute,
      hiddenRoute,
    });
    expect(visibleRoute.showInPrimaryNavigation).toBeUndefined();
    expect(hiddenRoute.showInPrimaryNavigation).toBe(false);
  });

  it('accepts the current serialized theme config shape', () => {
    const theme: ThemeConfig = {
      id: 'theme-default',
      name: 'Default',
      light: {
        primaryColor: '#3366ff',
        harmony: 'analogous',
      },
      dark: {
        primaryColor: '#3366ff',
        harmony: 'analogous',
      },
    };

    expect(theme.light.primaryColor).toBe('#3366ff');
    expect(theme.light.harmony).toBe('analogous');
  });

  it('serializes authored global theme tokens and recipe override values', () => {
    const theme: ThemeConfig = {
      id: 'theme-default',
      name: 'Default',
      light: {
        primaryColor: '#3366ff',
        harmony: 'analogous',
      },
      dark: {
        primaryColor: '#7799ff',
        harmony: 'analogous',
      },
      tokens: {
        spacing: { m: 18, l: 28 },
        radii: { m: 10, l: 18 },
        typography: {
          sizes: { body: 16, lead: 20 },
          weights: { body: '400', strong: '700' },
          headings: {
            h1: { size: 34, lineHeight: 42, weight: '700' },
          },
        },
        shadows: { soft: 3 },
      },
      recipes: {
        components: {
          Card: { compact: true, padding: 'l', radius: 'm', tone: 'subtle' },
        },
        patterns: {
          Panel: { compact: false, padding: 'xl' },
        },
      },
    };

    expect(JSON.parse(JSON.stringify(theme))).toEqual(theme);
    expect(theme.tokens?.spacing?.m).toBe(18);
    expect(theme.recipes?.components?.Card?.compact).toBe(true);
    expect(theme.recipes?.patterns?.Panel?.padding).toBe('xl');
  });

  it('accepts screens with operation data loaders and repeat empty-state nodes', () => {
    const manifest: Pick<AppManifest, 'screens'> = {
      screens: {
        products: {
          id: 'products',
          name: 'Products',
          root: {
            id: 'products-grid',
            type: 'Grid',
            repeat: {
              source: {
                kind: 'operation',
                operation: {
                  dataSourceId: 'nutrition-api',
                  endpointId: 'products',
                  operationId: 'nutrition.products.list',
                },
                path: 'products',
              },
              empty: [
                {
                  id: 'products-empty',
                  type: 'Notice',
                  props: {
                    title: 'No products found',
                  },
                },
              ],
            },
            children: [],
          },
          dataLoaders: [
            {
              kind: 'operation',
              id: 'product-detail',
              operation: {
                dataSourceId: 'nutrition-api',
                endpointId: 'products',
                operationId: 'nutrition.products.getById',
              },
              input: {
                id: {
                  kind: 'source',
                  source: {
                    kind: 'context',
                    path: 'route.params.id',
                  },
                },
              },
            },
          ],
        },
      },
    };

    expect(JSON.parse(JSON.stringify(manifest))).toEqual(manifest);
    expect(manifest.screens.products?.dataLoaders?.[0]?.kind).toBe('operation');
    expect(manifest.screens.products?.root.repeat?.empty?.[0]?.type).toBe('Notice');
  });

  it('selects in-memory application state independently from infrastructure', () => {
    const state: AppStateSpec = {
      provider: 'legend',
      persistence: false,
    };
    const manifest: Pick<AppManifest, 'infra' | 'state'> = {
      state,
      infra: {
        environments: {
          local: {
            deployment: { compute: { provider: 'local' }, runtime: { provider: 'minikube' } },
          },
        },
        modules: {
          'expo-localization': {
            config: {
              defaultLocale: 'en',
            },
          },
        },
      },
    };

    expect(JSON.parse(JSON.stringify(manifest))).toEqual({
      state,
      infra: {
        environments: manifest.infra.environments,
        modules: {
          'expo-localization': {
            config: {
              defaultLocale: 'en',
            },
          },
        },
      },
    });
  });

  it('exposes only canonical module fields without reserving external plugin terminology', () => {
    type HasLegacyModules = 'plugins' extends keyof InfraManifest ? true : false;
    type HasLegacyModulesConfig = 'pluginsConfig' extends keyof InfraManifest ? true : false;

    const hasLegacyModules: HasLegacyModules = false;
    const hasLegacyModulesConfig: HasLegacyModulesConfig = false;
    const infra: InfraManifest = {
      environments: {
        local: {
          deployment: { compute: { provider: 'local' }, runtime: { provider: 'minikube' } },
        },
      },
      modules: {
        'expo-localization': {
          config: {
            defaultLocale: 'en',
            locales: ['en', 'de'],
          },
        },
      },
    };
    // `plugins` remains valid when it names an unrelated external ecosystem concept,
    // such as Expo configuration plugins rather than Ankhorage Orchestrator modules.
    const expoConfig: { plugins: string[] } = {
      plugins: ['expo-router'],
    };

    expect(hasLegacyModules).toBe(false);
    expect(hasLegacyModulesConfig).toBe(false);
    expect(Object.keys(infra).sort()).toEqual(['environments', 'modules']);
    expect(expoConfig.plugins).toEqual(['expo-router']);
  });

  it('ThemeModeConfig.harmony accepts all ColorHarmony values', () => {
    for (const harmony of COLOR_HARMONIES) {
      const config = { primaryColor: '#ff0000', harmony } satisfies ThemeModeConfig;
      expect(config.harmony).toBe(harmony);
    }
  });

  it('serialized theme contains only primaryColor and harmony fields', () => {
    const mode: ThemeModeConfig = { primaryColor: '#3366ff', harmony: 'complementary' };
    const keys = Object.keys(mode);
    expect(keys).toEqual(['primaryColor', 'harmony']);
  });

  it('does not ship color generation files from contracts', async () => {
    const srcEntries = await readdir(join(process.cwd(), 'src'), { withFileTypes: true });
    const names = srcEntries.map((entry) => entry.name);

    expect(names.includes('colors')).toBe(false);
    expect(names.includes('color-theory.ts')).toBe(false);
  });

  it('removes obsolete contract symbols from src recursively', async () => {
    const banned = [
      'Color' + 'Tone',
      'color' + 'Tone',
      'COLOR_' + 'TONES',
      'Color' + 'Mood',
      'App' + 'Mood',
      'APP_' + 'MOODS',
      'suggested' + 'Color' + 'Tone',
      'APP_CATEGORY_' + 'THEME_RECOMMENDATIONS',
      'hide' + 'InTabBar',
    ];

    const srcFiles = await collectTypeScriptFiles(join(process.cwd(), 'src'));

    for (const file of srcFiles) {
      if (basename(file) === 'contracts.test.ts') continue;
      const content = await readFile(file, 'utf8');
      for (const symbol of banned) {
        expect(content.includes(symbol)).toBe(false);
      }
    }
  });

  it('accepts canonical auth flow config without legacy route fields', () => {
    const authFlow: AuthFlowConfig = {
      signInRoute: '/sign-in',
      signUpRoute: '/sign-up',
      signOutRoute: '/sign-out',
      forgotPasswordRoute: '/forgot-password',
      postSignInRoute: '/',
      unauthorizedRoute: '/sign-in',
    };

    const auth: InfraAuthSpec = {
      scope: 'global',
      provider: 'supabase',
      flow: authFlow,
      signIn: { identifiers: ['email'] },
      signUp: {
        requiredFields: ['email', 'password'],
        optionalFields: ['displayName'],
        signUpPolicy: 'requireVerification',
      },
    };

    expect(AUTH_SIGN_IN_IDENTIFIERS).toEqual(['email', 'username', 'phone']);
    expect(AUTH_SIGN_UP_POLICIES).toEqual(['autoSignIn', 'requireVerification']);
    expect(auth.flow?.signInRoute).toBe('/sign-in');
    expect(auth.signUp?.signUpPolicy).toBe('requireVerification');
  });

  it('requires data for successful non-void storage results', () => {
    const uploaded: StorageResult<StorageUploadResult> = {
      ok: true,
      data: {
        asset: {
          storageId: 'default',
          bucket: 'app-assets',
          path: 'images/logo.png',
        },
      },
    };

    expect(uploaded.ok).toBe(true);
    expect(uploaded.data.asset.bucket).toBe('app-assets');
    expect(uploaded.data.asset.path).toBe('images/logo.png');
  });

  it('accepts a public URL result for storage assets', () => {
    const resolved: StorageResult<StoragePublicUrlResult> = {
      ok: true,
      data: {
        publicUrl: 'https://cdn.example.com/app-assets/images/logo.png',
      },
    };

    expect(resolved.ok).toBe(true);
    expect(resolved.data.publicUrl).toContain('https://');
  });

  it('serializes image asset sources without provider-specific runtime values', () => {
    const source: ImageAssetSource = {
      kind: 'storage',
      storageId: 'default',
      bucket: 'app-assets',
      path: 'images/logo.png',
      publicUrl: 'https://cdn.example.com/app-assets/images/logo.png',
      alt: 'Logo',
      width: 1200,
      height: 630,
      contentType: 'image/png',
      metadata: {
        fileName: 'logo.png',
        sizeBytes: 123456,
        createdAt: '2026-05-10T00:00:00.000Z',
      },
    };

    expect(JSON.parse(JSON.stringify(source))).toEqual(source);
  });

  it('serializes normalized form submit event DTOs', () => {
    const event: FormSubmitEventDto = {
      type: 'form.submit',
      sourceNodeId: 'contact-form',
      payload: {
        values: {
          firstname: 'Fabio',
          message: 'This is my contact message',
          newsletter: true,
        },
      },
    };

    expect(JSON.parse(JSON.stringify(event))).toEqual(event);
    expect(event.payload.values.message).toBe('This is my contact message');
  });

  it('serializes normalized button press event DTOs', () => {
    const event: ButtonPressEventDto = {
      type: 'button.press',
      sourceNodeId: 'submit-button',
      payload: {},
    };

    expect(JSON.parse(JSON.stringify(event))).toEqual(event);
    expect(event.type).toBe('button.press');
  });

  it('serializes normalized collection item press event DTOs', () => {
    const event: CollectionItemPressEventDto = {
      type: 'collection.itemPress',
      sourceNodeId: 'posts-list',
      payload: {
        itemId: 'post-1',
        item: {
          id: 'post-1',
          title: 'Hello',
        },
      },
    };

    expect(JSON.parse(JSON.stringify(event))).toEqual(event);
    expect(event.payload.item.title).toBe('Hello');
  });

  it('accepts custom component event DTOs through the same envelope', () => {
    const event: ComponentEventDto<'media.play', { readonly mediaId: string }> = {
      type: 'media.play',
      sourceNodeId: 'hero-video',
      payload: {
        mediaId: 'video-1',
      },
    };
    const knownEventType: ComponentEventDtoKind = 'form.submit';

    expect(event.payload.mediaId).toBe('video-1');
    expect(knownEventType).toBe('form.submit');
  });

  it('accepts a provider-neutral CRUD database adapter', async () => {
    const adapter: DbAdapter = {
      capabilities: {
        transactions: false,
        returning: true,
        realtime: false,
      },
      select() {
        return Promise.resolve({ ok: true, data: [{ id: 'post-1', title: 'Hello' }] });
      },
      findById() {
        return Promise.resolve({ ok: true, data: { id: 'post-1', title: 'Hello' } });
      },
      insert(input) {
        const values = Array.isArray(input.values) ? input.values : [input.values];
        return Promise.resolve({ ok: true, data: values });
      },
      update() {
        return Promise.resolve({ ok: true, data: [{ id: 'post-1', title: 'Updated' }] });
      },
      delete() {
        return Promise.resolve({ ok: true, data: [{ id: 'post-1', title: 'Deleted' }] });
      },
    };

    const result = await adapter.select({
      table: 'posts',
      filters: [{ field: 'title', operator: 'startsWith', value: 'Hel' }],
      sort: [{ field: 'title', direction: 'asc' }],
      page: { limit: 10 },
    });

    expect(result.ok).toBe(true);
    expect(result.ok ? result.data[0]?.id : undefined).toBe('post-1');
  });

  it('accepts a provider-neutral realtime database adapter', () => {
    const received: DbChangeEvent[] = [];
    const adapter: DbRealtimeAdapter = {
      realtime: {
        subscribeToCollection(_input, listener) {
          listener({
            table: 'posts',
            schema: 'public',
            kind: 'insert',
            record: { id: 'post-1' },
            committedAt: '2026-05-12T10:00:00.000Z',
          });

          return { unsubscribe: () => undefined };
        },
        subscribeToRecord(_input, listener) {
          listener({
            table: 'posts',
            kind: 'update',
            record: { id: 'post-1', title: 'Updated' },
            previousRecord: { id: 'post-1', title: 'Old' },
          });

          return { unsubscribe: () => undefined };
        },
      },
    };

    const subscription = adapter.realtime.subscribeToCollection({ table: 'posts' }, (event) => {
      received.push(event);
    });

    void subscription.unsubscribe();

    expect(received).toEqual([
      {
        table: 'posts',
        schema: 'public',
        kind: 'insert',
        record: { id: 'post-1' },
        committedAt: '2026-05-12T10:00:00.000Z',
      },
    ]);
  });

  it('accepts a provider-neutral database admin adapter', async () => {
    const adapter: DbAdminAdapter = {
      capabilities: {
        schemaGeneration: true,
        directExecution: false,
      },
      createCollection(input) {
        return Promise.resolve({
          ok: true,
          executed: false,
          sql: `create table ${input.name}`,
        });
      },
      deleteCollection(input) {
        return Promise.resolve({
          ok: true,
          executed: false,
          sql: `drop table ${input.name}`,
        });
      },
      generateCreateCollectionSql(input) {
        return {
          ok: true,
          executed: false,
          sql: `create table ${input.name}`,
        };
      },
      generateDeleteCollectionSql(input) {
        return {
          ok: true,
          executed: false,
          sql: `drop table ${input.name}`,
        };
      },
    };

    const result = await adapter.createCollection({
      name: 'posts',
      schema: 'public',
      primaryKey: 'id',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'metadata', type: 'json' },
      ],
    });

    expect(result).toEqual({ ok: true, executed: false, sql: 'create table posts' });
  });
});
