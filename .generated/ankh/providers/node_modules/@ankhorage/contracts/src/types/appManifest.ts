import type { AppManifest } from '../types';

export type AppManifestParseResult =
  | { readonly ok: true; readonly manifest: AppManifest }
  | { readonly ok: false; readonly message: string };
