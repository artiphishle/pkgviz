import { describe, expect, it } from 'bun:test';

import type { UiComponentMeta } from './ui';

const imageComponentMeta = {
  name: 'Image',
  category: 'component',
  directManifestNode: true,
  allowedChildren: [],
  props: {
    source: {
      type: 'media',
      category: 'Content',
      label: 'Source',
      mediaKinds: ['image'],
    },
  },
} as const satisfies UiComponentMeta;

describe('UI media authoring metadata', () => {
  it('describes media-backed properties independently from concrete providers', () => {
    expect(imageComponentMeta.props.source).toEqual({
      type: 'media',
      category: 'Content',
      label: 'Source',
      mediaKinds: ['image'],
    });
  });

  it('remains serializable for package manifests and Studio metadata', () => {
    expect(JSON.parse(JSON.stringify(imageComponentMeta))).toEqual(imageComponentMeta);
  });
});
