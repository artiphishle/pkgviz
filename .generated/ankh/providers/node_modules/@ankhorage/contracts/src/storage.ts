export interface StorageAdapterError {
  code: string;
  message: string;
  cause?: unknown;
}

export type StorageOkResult<TData> = [TData] extends [void]
  ? { ok: true; data?: undefined }
  : { ok: true; data: TData };

export type StorageResult<TData = void> =
  | StorageOkResult<TData>
  | {
      ok: false;
      error: StorageAdapterError;
    };

export interface StorageAssetReference {
  storageId?: string;
  bucket: string;
  path: string;
  publicUrl?: string;
}

export interface StorageUploadInput {
  storageId?: string;
  bucket: string;
  path: string;
  body: Uint8Array;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export interface StorageUploadResult {
  asset: StorageAssetReference;
}

export interface StorageRemoveInput {
  storageId?: string;
  bucket: string;
  path: string;
}

export interface StoragePublicUrlInput {
  storageId?: string;
  bucket: string;
  path: string;
}

export interface StoragePublicUrlResult {
  publicUrl: string;
}

export interface StorageObjectMetadata {
  storageId?: string;
  bucket: string;
  path: string;
  contentType?: string;
  sizeBytes?: number;
  createdAt?: string;
  updatedAt?: string;
  etag?: string;
}

export interface StorageListInput {
  storageId?: string;
  bucket: string;
  prefix?: string;
  cursor?: string;
  limit?: number;
}

export interface StorageListResult {
  objects: readonly StorageObjectMetadata[];
  nextCursor?: string;
}

export type StorageResolvedAccess = 'public' | 'signed';

export interface StorageResolveInput {
  storageId?: string;
  bucket: string;
  path: string;
  access?: StorageResolvedAccess;
  expiresInSeconds?: number;
}

export interface StorageResolvedAsset {
  storageId?: string;
  bucket: string;
  path: string;
  url: string;
  access: StorageResolvedAccess;
  expiresAt?: string;
}

export interface StorageResolveResult {
  asset: StorageResolvedAsset;
}

export interface ImageMetadata {
  fileName?: string;
  sizeBytes?: number;
  createdAt?: string;
}

export interface StorageImageAssetSource {
  kind: 'storage';
  storageId?: string;
  bucket: string;
  path: string;
  publicUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
  contentType?: string;
  metadata?: ImageMetadata;
}

export interface UrlImageAssetSource {
  kind: 'url';
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  contentType?: string;
  metadata?: ImageMetadata;
}

export type ImageAssetSource = StorageImageAssetSource | UrlImageAssetSource;

export interface StorageAdapter {
  upload(input: StorageUploadInput): Promise<StorageResult<StorageUploadResult>>;
  remove(input: StorageRemoveInput): Promise<StorageResult>;
  publicUrl(input: StoragePublicUrlInput): Promise<StorageResult<StoragePublicUrlResult>>;
  getImageMetadata?(input: StorageAssetReference): Promise<StorageResult<ImageMetadata>>;
}

export interface StorageListAdapter {
  list(input: StorageListInput): Promise<StorageResult<StorageListResult>>;
}

export interface StorageResolveAdapter {
  resolve(input: StorageResolveInput): Promise<StorageResult<StorageResolveResult>>;
}

/**
 * Storage capability required by the app-authoring media service.
 *
 * Remote URL import/ingest is intentionally not part of this low-level object-storage
 * contract. It is a trusted service operation that can be implemented by reading the
 * remote object and delegating to `upload` when ingestion is requested.
 */
export interface MediaStorageAdapter
  extends StorageAdapter, StorageListAdapter, StorageResolveAdapter {}
