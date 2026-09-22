import { hasOnlyKeys, isRecord } from '@ankhorage/utility/object';
import { isNonEmptyString, isOptionalString } from '@ankhorage/utility/string';

import {
  MEDIA_ASSET_KINDS,
  type MediaAsset,
  type MediaAssetMetadata,
  type MediaAssetSource,
  type MediaManifest,
} from '../media';

const MEDIA_ASSET_KIND_SET = new Set<string>(MEDIA_ASSET_KINDS);

/*** Validate authored media assets and their registry identity. */
export function isMediaManifest(value: unknown): value is MediaManifest {
  if (!isRecord(value) || !hasOnlyKeys(value, ['assets']) || !isRecord(value.assets)) return false;

  return Object.entries(value.assets).every(
    ([assetId, asset]) => isMediaAsset(asset) && asset.id === assetId,
  );
}

/*** Validate media identity, kind, source and optional metadata. */
function isMediaAsset(value: unknown): value is MediaAsset {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ['id', 'name', 'kind', 'source', 'contentType', 'metadata']) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.name) &&
    typeof value.kind === 'string' &&
    MEDIA_ASSET_KIND_SET.has(value.kind) &&
    isMediaAssetSource(value.source) &&
    isOptionalString(value.contentType) &&
    (value.metadata === undefined || isMediaAssetMetadata(value.metadata))
  );
}

/*** Validate the selected bundled, URL or storage-backed media source. */
function isMediaAssetSource(value: unknown): value is MediaAssetSource {
  if (!isRecord(value) || typeof value.kind !== 'string') return false;

  if (value.kind === 'storage') {
    return (
      hasOnlyKeys(value, ['kind', 'storageId', 'bucket', 'path']) &&
      isOptionalString(value.storageId) &&
      isNonEmptyString(value.bucket) &&
      isNonEmptyString(value.path)
    );
  }

  if (value.kind === 'url') {
    return hasOnlyKeys(value, ['kind', 'url']) && isStableRemoteUrl(value.url);
  }

  return (
    value.kind === 'bundled' && hasOnlyKeys(value, ['kind', 'path']) && isBundledPath(value.path)
  );
}

/*** Validate optional descriptive and numeric media metadata. */
function isMediaAssetMetadata(value: unknown): value is MediaAssetMetadata {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, [
      'originalFileName',
      'sizeBytes',
      'createdAt',
      'width',
      'height',
      'durationMs',
    ]) &&
    isOptionalString(value.originalFileName) &&
    isOptionalString(value.createdAt) &&
    isOptionalFiniteNonNegativeNumber(value.sizeBytes) &&
    isOptionalFinitePositiveNumber(value.width) &&
    isOptionalFinitePositiveNumber(value.height) &&
    isOptionalFiniteNonNegativeNumber(value.durationMs)
  );
}

/*** Validate an authored HTTP or HTTPS media URL. */
function isStableRemoteUrl(value: unknown): boolean {
  return typeof value === 'string' && /^https?:\/\//iu.test(value.trim());
}

/*** Validate a portable bundled-media path. */
function isBundledPath(value: unknown): boolean {
  if (!isNonEmptyString(value)) return false;
  const path = value.trim();
  if (path.startsWith('/') || /^[a-z][a-z0-9+.-]*:/iu.test(path)) return false;
  return !path.split('/').includes('..');
}

/*** Accept an omitted media metric or a finite non-negative number. */
function isOptionalFiniteNonNegativeNumber(value: unknown): boolean {
  return value === undefined || (typeof value === 'number' && Number.isFinite(value) && value >= 0);
}

/*** Accept an omitted media metric or a finite positive number. */
function isOptionalFinitePositiveNumber(value: unknown): boolean {
  return value === undefined || (typeof value === 'number' && Number.isFinite(value) && value > 0);
}
