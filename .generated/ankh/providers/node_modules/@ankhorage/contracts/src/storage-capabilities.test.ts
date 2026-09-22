import { describe, expect, it } from 'bun:test';

import type { MediaStorageAdapter } from './storage';

const adapter: MediaStorageAdapter = {
  upload(input) {
    return Promise.resolve({
      ok: true,
      data: {
        asset: {
          storageId: input.storageId,
          bucket: input.bucket,
          path: input.path,
        },
      },
    });
  },
  remove() {
    return Promise.resolve({ ok: true });
  },
  publicUrl(input) {
    return Promise.resolve({
      ok: true,
      data: { publicUrl: `https://cdn.example.test/${input.bucket}/${input.path}` },
    });
  },
  list(input) {
    return Promise.resolve({
      ok: true,
      data: {
        objects: [
          {
            storageId: input.storageId,
            bucket: input.bucket,
            path: `${input.prefix ?? ''}hero.png`,
            contentType: 'image/png',
            sizeBytes: 4096,
          },
        ],
      },
    });
  },
  resolve(input) {
    return Promise.resolve({
      ok: true,
      data: {
        asset: {
          storageId: input.storageId,
          bucket: input.bucket,
          path: input.path,
          url: `https://signed.example.test/${input.bucket}/${input.path}`,
          access: input.access ?? 'signed',
          expiresAt: '2026-08-12T10:00:00.000Z',
        },
      },
    });
  },
};

describe('media storage capabilities', () => {
  it('lists normalized provider-neutral object metadata', async () => {
    const result = await adapter.list({
      storageId: 'primary',
      bucket: 'media',
      prefix: 'authoring/',
    });

    expect(result).toEqual({
      ok: true,
      data: {
        objects: [
          {
            storageId: 'primary',
            bucket: 'media',
            path: 'authoring/hero.png',
            contentType: 'image/png',
            sizeBytes: 4096,
          },
        ],
      },
    });
  });

  it('resolves a stable storage identity to a runtime-readable URL', async () => {
    const result = await adapter.resolve({
      storageId: 'primary',
      bucket: 'media',
      path: 'authoring/hero.png',
      access: 'signed',
      expiresInSeconds: 900,
    });

    expect(result).toEqual({
      ok: true,
      data: {
        asset: {
          storageId: 'primary',
          bucket: 'media',
          path: 'authoring/hero.png',
          url: 'https://signed.example.test/media/authoring/hero.png',
          access: 'signed',
          expiresAt: '2026-08-12T10:00:00.000Z',
        },
      },
    });
  });
});
