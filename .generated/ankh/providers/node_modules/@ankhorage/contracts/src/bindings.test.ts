import { readOwnProperty } from '@ankhorage/utility/object';
import { describe, expect, it } from 'bun:test';

import type {
  AppManifest,
  BindingInputMap,
  BindingValueSource,
  ComponentDataBinding,
  ComponentDataBindingRegistry,
  EventBinding,
  OperationScreenDataLoaderDefinition,
  PropBinding,
  ScreenDataLoaderDefinition,
} from './index';

function assertSerializable<TValue>(value: TValue): void {
  expect(JSON.parse(JSON.stringify(value))).toEqual(value);
}

describe('component data-binding contracts', () => {
  it('serializes a component prop bound to an operation response path', () => {
    const binding: ComponentDataBinding = {
      componentId: 'hero-title',
      componentType: 'Text',
      props: {
        children: {
          source: {
            kind: 'operation',
            operation: {
              apiId: 'cms',
              endpointId: 'pages',
              operationId: 'pages.getHome',
            },
            path: '$.data.title',
          },
          fallback: {
            value: 'Untitled',
          },
          loading: {
            state: 'loading',
            fallback: {
              value: 'Loading…',
            },
          },
          error: {
            state: 'error',
            message: 'Could not load title.',
            fallback: {
              value: 'Untitled',
            },
          },
          transforms: ['trim'],
        },
      },
    };

    assertSerializable(binding);
    expect(binding.props?.children?.source.kind).toBe('operation');
  });

  it('serializes literal, context, event, state, and operation value sources', () => {
    const sources: readonly BindingValueSource[] = [
      { kind: 'literal', value: { fallback: 'Untitled' } },
      { kind: 'context', path: 'auth.user.displayName' },
      { kind: 'event', path: 'payload.values.search' },
      { kind: 'state', path: 'forms.search.query' },
      {
        kind: 'operation',
        operation: {
          apiId: 'search-api',
          operationId: 'search.query',
        },
        path: '$.results',
      },
    ];

    assertSerializable(sources);
    expect(sources.map((source) => source.kind)).toEqual([
      'literal',
      'context',
      'event',
      'state',
      'operation',
    ]);
  });

  it('serializes an event binding that executes an API operation', () => {
    const input: BindingInputMap = {
      email: {
        kind: 'source',
        source: {
          kind: 'event',
          path: 'payload.values.email',
        },
        transforms: ['trim', 'lowercase'],
      },
      message: {
        kind: 'source',
        source: {
          kind: 'event',
          path: 'payload.values.message',
        },
      },
      source: {
        kind: 'literal',
        value: 'contact-form',
      },
      metadata: {
        kind: 'object',
        fields: {
          userId: {
            kind: 'source',
            source: {
              kind: 'context',
              path: 'auth.user.id',
            },
          },
        },
      },
    };

    const binding: EventBinding = {
      target: {
        kind: 'operation',
        operation: {
          apiId: 'contact-api',
          endpointId: 'messages',
          operationId: 'messages.create',
        },
      },
      input,
      when: {
        source: {
          kind: 'event',
          path: 'payload.values.email',
        },
        operator: 'exists',
      },
    };

    assertSerializable(binding);
    expect(binding.target.kind).toBe('operation');
    expect(binding.input?.email?.kind).toBe('source');
  });

  it('serializes an event binding that targets a named action', () => {
    const binding: EventBinding = {
      target: {
        kind: 'action',
        type: 'toast.show',
      },
      input: {
        message: {
          kind: 'literal',
          value: 'Saved successfully.',
        },
      },
    };

    assertSerializable(binding);
    expect(binding.target.kind).toBe('action');
  });

  it('serializes canonical operation screen data loaders', () => {
    const loader: ScreenDataLoaderDefinition = {
      kind: 'operation',
      id: 'product-detail',
      operation: {
        apiId: 'nutrition',
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
    } satisfies OperationScreenDataLoaderDefinition;

    assertSerializable(loader);
    expect(loader.kind).toBe('operation');
  });

  it('serializes scanner lookup and conditional navigation intent using existing generic bindings', () => {
    const productLookupOperation = {
      apiId: 'nutrition',
      endpointId: 'products',
      operationId: 'products.lookupByBarcode',
    } as const;

    const bindings: ComponentDataBindingRegistry = {
      scanner: {
        componentId: 'scanner',
        componentType: 'BarcodeScannerView',
        events: {
          barcodeScanned: [
            {
              target: {
                kind: 'operation',
                operation: productLookupOperation,
              },
              input: {
                barcode: {
                  kind: 'source',
                  source: {
                    kind: 'event',
                    path: 'payload.value',
                  },
                  transforms: ['trim'],
                },
              },
              when: {
                source: {
                  kind: 'event',
                  path: 'payload.value',
                },
                operator: 'exists',
              },
            },
            {
              target: {
                kind: 'action',
                type: 'navigate',
              },
              input: {
                route: {
                  kind: 'literal',
                  value: 'product-detail',
                },
                params: {
                  kind: 'object',
                  fields: {
                    barcode: {
                      kind: 'source',
                      source: {
                        kind: 'event',
                        path: 'payload.value',
                      },
                      transforms: ['trim'],
                    },
                    productId: {
                      kind: 'source',
                      source: {
                        kind: 'operation',
                        operation: productLookupOperation,
                        path: 'product.id',
                      },
                    },
                  },
                },
              },
              when: {
                source: {
                  kind: 'operation',
                  operation: productLookupOperation,
                  path: 'product.id',
                },
                operator: 'exists',
              },
            },
            {
              target: {
                kind: 'action',
                type: 'navigate',
              },
              input: {
                route: {
                  kind: 'literal',
                  value: 'product-capture',
                },
                params: {
                  kind: 'object',
                  fields: {
                    barcode: {
                      kind: 'source',
                      source: {
                        kind: 'event',
                        path: 'payload.value',
                      },
                      transforms: ['trim'],
                    },
                  },
                },
              },
              when: {
                source: {
                  kind: 'operation',
                  operation: productLookupOperation,
                  path: 'product.id',
                },
                operator: 'notExists',
              },
            },
          ],
        },
      },
    };

    assertSerializable(bindings);
    expect(bindings.scanner?.events?.barcodeScanned).toHaveLength(3);
    expect(bindings.scanner?.events?.barcodeScanned?.[0]?.target.kind).toBe('operation');
    expect(bindings.scanner?.events?.barcodeScanned?.[1]?.when?.source.kind).toBe('operation');
    expect(bindings.scanner?.events?.barcodeScanned?.[2]?.target.type).toBe('navigate');
  });

  it('serializes repeated container nodes with generic item-context bindings', () => {
    const productsListOperation = {
      apiId: 'catalog-api',
      endpointId: 'products',
      operationId: 'products.list',
    } as const;

    const root: AppManifest['screens'][string]['root'] = {
      id: 'products-grid',
      type: 'Grid',
      repeat: {
        source: {
          kind: 'operation',
          operation: productsListOperation,
        },
        itemAlias: 'item',
        keyPath: 'id',
      },
      children: [
        {
          id: 'product-card-template',
          type: 'ProductCard',
        },
      ],
    };

    const bindings: ComponentDataBindingRegistry = {
      'product-card-template': {
        componentId: 'product-card-template',
        componentType: 'ProductCard',
        props: {
          title: {
            source: {
              kind: 'context',
              path: 'item.name',
            },
          },
          brand: {
            source: {
              kind: 'context',
              path: 'item.brand',
            },
          },
          description: {
            source: {
              kind: 'context',
              path: 'item.barcode',
            },
          },
        },
        events: {
          press: [
            {
              target: {
                kind: 'action',
                type: 'navigate',
              },
              input: {
                route: {
                  kind: 'literal',
                  value: '/products/[id]',
                },
                params: {
                  kind: 'object',
                  fields: {
                    id: {
                      kind: 'source',
                      source: {
                        kind: 'context',
                        path: 'item.id',
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    };

    assertSerializable({ root, bindings });
    expect(root.repeat).toEqual({
      source: {
        kind: 'operation',
        operation: productsListOperation,
      },
      itemAlias: 'item',
      keyPath: 'id',
    });
    expect(bindings['product-card-template']?.props?.title?.source).toEqual({
      kind: 'context',
      path: 'item.name',
    });
    expect(bindings['product-card-template']?.events?.press?.[0]?.input?.params).toEqual({
      kind: 'object',
      fields: {
        id: {
          kind: 'source',
          source: {
            kind: 'context',
            path: 'item.id',
          },
        },
      },
    });
  });

  it('serializes component data-binding registries', () => {
    const bindings: ComponentDataBindingRegistry = {
      'submit-button': {
        componentId: 'submit-button',
        componentType: 'Button',
        props: {
          children: {
            source: {
              kind: 'literal',
              value: 'Send',
            },
          },
          disabled: {
            source: {
              kind: 'state',
              path: 'forms.contact.isSubmitting',
            },
          },
        },
        events: {
          press: [
            {
              target: {
                kind: 'operation',
                operation: {
                  apiId: 'contact-api',
                  operationId: 'messages.create',
                },
              },
            },
          ],
        },
      },
    };

    assertSerializable(bindings);
    expect(bindings['submit-button']?.events?.press?.[0]?.target.kind).toBe('operation');
  });

  it('serializes app-level APIs and dataBindings on the manifest', () => {
    const propBinding: PropBinding = {
      source: {
        kind: 'operation',
        operation: {
          apiId: 'cms',
          endpointId: 'pages',
          operationId: 'pages.getHome',
        },
        path: '$.data.heroTitle',
      },
    };

    const manifest: AppManifest = {
      metadata: {
        name: 'Demo',
        slug: 'demo',
        version: '1.0.0',
        category: 'developer_tools',
        themeId: 'default',
      },
      themes: {
        default: {
          id: 'default',
          name: 'Default',
          light: {
            primaryColor: '#3366ff',
            harmony: 'analogous',
          },
          dark: {
            primaryColor: '#3366ff',
            harmony: 'analogous',
          },
        },
      },
      activeThemeId: 'default',
      infra: {
        environments: {
          local: {
            deployment: { compute: { provider: 'local' }, runtime: { provider: 'minikube' } },
          },
        },
        apis: {
          cms: {
            id: 'cms',
            origin: 'external',
            protocol: 'rest',
            baseUrl: 'https://cms.example.com',
            endpoints: {
              pages: {
                id: 'pages',
                kind: 'http',
                path: '/pages/home',
                operations: {
                  'pages.getHome': {
                    id: 'pages.getHome',
                    endpointId: 'pages',
                    protocol: 'http',
                    intent: 'read',
                    method: 'GET',
                    path: '/pages/home',
                  },
                },
              },
            },
          },
        },
        modules: {},
      },
      navigator: {
        type: 'stack',
        routes: [
          {
            name: 'home',
            screenId: 'home',
          },
        ],
      },
      screens: {
        home: {
          id: 'home',
          name: 'Home',
          root: {
            id: 'screen-root',
            type: 'Screen',
            children: [
              {
                id: 'hero-title',
                type: 'Text',
              },
            ],
          },
        },
      },
      dataBindings: {
        'hero-title': {
          componentId: 'hero-title',
          componentType: 'Text',
          props: {
            children: propBinding,
          },
        },
      },
      settings: {
        localization: {
          defaultLocale: 'en',
          locales: ['en'],
        },
      },
    };

    assertSerializable(manifest);
    expect(manifest.dataBindings?.['hero-title']?.props?.children?.source.kind).toBe('operation');
    expect(manifest.infra.apis ? readOwnProperty(manifest.infra.apis, 'cms')?.id : undefined).toBe(
      'cms',
    );
  });
});
