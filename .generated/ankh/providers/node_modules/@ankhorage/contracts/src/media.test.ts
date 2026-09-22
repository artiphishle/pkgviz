import { describe, expect, it } from 'bun:test';

import { isMediaManifest } from './appManifest/media';
import { isMediaAssetReference } from './media';

function createMediaManifest() {
  return {
    assets: {
      hero: {
        id: 'hero',
        name: 'Hero image',
        kind: 'image',
        source: { kind: 'storage', bucket: 'media', path: 'studio/hero.webp' },
        contentType: 'image/webp',
        metadata: { width: 1600, height: 900, sizeBytes: 42000 },
      },
      logo: {
        id: 'logo',
        name: 'Logo',
        kind: 'image',
        source: { kind: 'bundled', path: 'assets/logo.png' },
      },
      remote: {
        id: 'remote',
        name: 'Remote image',
        kind: 'image',
        source: { kind: 'url', url: 'https://example.test/image.png' },
      },
    },
  };
}

describe('media contracts', () => {
  it('accepts storage, bundled, and stable URL authoring media', () => {
    expect(isMediaManifest(createMediaManifest())).toBe(true);
  });

  it('requires registry keys to match media asset ids', () => {
    const media = createMediaManifest();
    media.assets.hero.id = 'other';

    expect(isMediaManifest(media)).toBe(false);
  });

  it('rejects transient or local URL schemes', () => {
    for (const url of [
      'blob:https://example.test/id',
      'file:///tmp/image.png',
      'data:image/png;base64,x',
    ]) {
      const media = createMediaManifest();
      media.assets.remote.source = { kind: 'url', url };
      expect(isMediaManifest(media)).toBe(false);
    }
  });

  it('rejects denormalized public URLs on managed storage sources', () => {
    const media = createMediaManifest();
    const source = media.assets.hero.source as Record<string, unknown>;
    source.publicUrl = 'https://example.test/public/hero.webp';

    expect(isMediaManifest(media)).toBe(false);
  });

  it('validates stable media references', () => {
    expect(isMediaAssetReference({ mediaId: 'hero' })).toBe(true);
    expect(isMediaAssetReference({ mediaId: 'hero', url: 'blob:local' })).toBe(false);
    expect(isMediaAssetReference({ mediaId: '' })).toBe(false);
  });
});
