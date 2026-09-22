import { describe, expect, it } from 'bun:test';

import type { UiComponentMeta, UiComponentMetaRegistry, UiComponentPackageManifest } from './index';

function assertSerializable<TValue>(value: TValue): void {
  expect(JSON.parse(JSON.stringify(value))).toEqual(value);
}

describe('ui component metadata contracts', () => {
  it('serializes component metadata with props, events, slots, i18n, and blueprint defaults', () => {
    const meta: UiComponentMeta = {
      name: 'Button',
      category: 'component',
      description: 'Action component used to trigger an interaction.',
      directManifestNode: true,
      allowedChildren: [],
      blueprint: {
        label: 'Button',
        icon: {
          name: 'cursor-default-click',
          provider: 'material-community',
        },
        defaultProps: {
          children: 'Continue',
          disabled: false,
          size: 'm',
        },
      },
      events: {
        press: {
          label: 'Press',
          eventType: 'button.press',
          description: 'Emitted when the button is pressed.',
          payloadFields: [],
        },
      },
      i18n: {
        fields: [
          {
            keyProp: 'i18nKey',
            defaultTextProp: 'children',
          },
        ],
      },
      slots: {
        icon: {
          label: 'Icon',
          allowedChildren: ['Icon'],
        },
      },
      props: {
        children: {
          type: 'string',
          category: 'Content',
          label: 'Label',
          default: 'Continue',
        },
        disabled: {
          type: 'boolean',
          category: 'State',
          label: 'Disabled',
          default: false,
        },
        size: {
          type: 'enum',
          category: 'Style',
          label: 'Size',
          enum: ['s', 'm', 'l'],
          default: 'm',
        },
      },
    };

    assertSerializable(meta);
    expect(meta.events?.press?.eventType).toBe('button.press');
    expect(meta.props.size?.enum).toEqual(['s', 'm', 'l']);
  });

  it('serializes component metadata with array item schemas', () => {
    const meta: UiComponentMeta = {
      name: 'DataTable',
      category: 'component',
      directManifestNode: true,
      allowedChildren: [],
      props: {
        columns: {
          type: 'array',
          category: 'Data',
          label: 'Columns',
          itemSchema: [
            {
              key: 'id',
              schema: {
                type: 'string',
                category: 'Data',
                label: 'Column id',
              },
            },
            {
              key: 'label',
              schema: {
                type: 'string',
                category: 'Data',
                label: 'Column label',
              },
            },
          ],
        },
      },
    };

    assertSerializable(meta);
    expect(meta.props.columns?.itemSchema?.map((item) => item.key)).toEqual(['id', 'label']);
  });

  it('serializes bindable prop and event metadata on component metadata', () => {
    const meta: UiComponentMeta = {
      name: 'Button',
      category: 'component',
      directManifestNode: true,
      allowedChildren: [],
      bindings: {
        props: {
          children: {
            label: 'Label',
            description: 'Text content rendered inside the button.',
            acceptsFallback: true,
            acceptsTransforms: true,
            value: {
              type: 'string',
              label: 'Button label',
            },
          },
          disabled: {
            label: 'Disabled',
            value: {
              type: 'boolean',
            },
          },
        },
        events: {
          press: {
            label: 'Press',
            description: 'Runs when the button is pressed.',
            payload: {
              eventType: 'button.press',
              fields: [],
            },
          },
        },
      },
      events: {
        press: {
          label: 'Press',
          eventType: 'button.press',
        },
      },
      props: {
        children: {
          type: 'string',
          category: 'Content',
          label: 'Label',
        },
        disabled: {
          type: 'boolean',
          category: 'State',
          label: 'Disabled',
        },
      },
    };

    assertSerializable(meta);
    expect(meta.bindings?.props?.children?.value.type).toBe('string');
    expect(meta.bindings?.events?.press?.payload?.eventType).toBe('button.press');
  });

  it('serializes bindable collection item metadata with nested value fields', () => {
    const meta: UiComponentMeta = {
      name: 'List',
      category: 'pattern',
      directManifestNode: true,
      allowedChildren: [],
      bindings: {
        props: {
          items: {
            label: 'Items',
            value: {
              type: 'array',
              itemType: 'object',
              fields: [
                {
                  path: '$.id',
                  type: 'string',
                  label: 'ID',
                  required: true,
                },
                {
                  path: '$.title',
                  type: 'string',
                  label: 'Title',
                },
              ],
            },
          },
        },
        events: {
          itemPress: {
            label: 'Item press',
            payload: {
              eventType: 'collection.itemPress',
              fields: [
                {
                  path: 'payload.itemId',
                  type: 'string',
                  label: 'Item ID',
                },
                {
                  path: 'payload.item',
                  type: 'record',
                  label: 'Item',
                },
              ],
            },
          },
        },
      },
      props: {
        items: {
          type: 'array',
          category: 'Data',
          label: 'Items',
        },
      },
    };

    assertSerializable(meta);
    expect(meta.bindings?.props?.items?.value.fields?.map((field) => field.path)).toEqual([
      '$.id',
      '$.title',
    ]);
    expect(meta.bindings?.events?.itemPress?.payload?.eventType).toBe('collection.itemPress');
  });

  it('serializes a component metadata registry', () => {
    const registry: UiComponentMetaRegistry = {
      Text: {
        name: 'Text',
        category: 'component',
        directManifestNode: true,
        allowedChildren: [],
        bindings: {
          props: {
            children: {
              value: {
                type: 'string',
              },
            },
          },
        },
        props: {
          children: {
            type: 'string',
            category: 'Content',
            label: 'Text',
          },
        },
      },
      Screen: {
        name: 'Screen',
        category: 'layout',
        directManifestNode: true,
        allowedChildren: ['Text'],
        props: {},
      },
    };

    assertSerializable(registry);
    expect(registry.Screen?.allowedChildren).toEqual(['Text']);
    expect(registry.Text?.bindings?.props?.children?.value.type).toBe('string');
  });

  it('serializes a component package manifest for extension packages', () => {
    const manifest: UiComponentPackageManifest = {
      packageName: '@ankhorage/zora-chessboard',
      displayName: 'ZORA Chessboard',
      components: {
        Chessboard: {
          name: 'Chessboard',
          category: 'component',
          directManifestNode: true,
          allowedChildren: [],
          bindings: {
            props: {
              fen: {
                value: {
                  type: 'string',
                  label: 'FEN',
                },
              },
            },
            events: {
              move: {
                label: 'Move',
                payload: {
                  eventType: 'chess.move',
                  fields: [
                    {
                      path: 'payload.from',
                      type: 'string',
                      label: 'From square',
                    },
                    {
                      path: 'payload.to',
                      type: 'string',
                      label: 'To square',
                    },
                  ],
                },
              },
            },
          },
          events: {
            move: {
              label: 'Move',
              eventType: 'chess.move',
              payloadFields: [
                {
                  path: 'payload.from',
                  type: 'string',
                  label: 'From square',
                },
                {
                  path: 'payload.to',
                  type: 'string',
                  label: 'To square',
                },
              ],
            },
          },
          props: {
            fen: {
              type: 'string',
              category: 'Chess',
              label: 'FEN',
            },
            orientation: {
              type: 'enum',
              category: 'Chess',
              label: 'Orientation',
              enum: ['white', 'black'],
              default: 'white',
            },
          },
        },
      },
    };

    assertSerializable(manifest);
    expect(manifest.components.Chessboard?.events?.move?.eventType).toBe('chess.move');
    expect(manifest.components.Chessboard?.bindings?.props?.fen?.value.type).toBe('string');
  });
});
