import type { SerializableSet } from './collections';

export const ANKHORAGE_PERMISSION_NAMES = [
  'camera',
  'microphone',
  'mediaLibrary',
  'mediaLibraryWrite',
  'locationForeground',
  'locationBackground',
  'notifications',
  'clipboard',
] as const;

export type AnkhoragePermissionName = (typeof ANKHORAGE_PERMISSION_NAMES)[number];

export const ANKHORAGE_CAPABILITY_NAMES = [
  'barcodeScanner',
  'cameraPreview',
  'ebookReader',
  'mediaPicker',
  'filePicker',
  'location',
  'notifications',
  'clipboard',
] as const;

export type AnkhorageCapabilityName = (typeof ANKHORAGE_CAPABILITY_NAMES)[number];

export interface ScreenRequirements {
  readonly permissions?: SerializableSet<AnkhoragePermissionName>;
  readonly capabilities?: SerializableSet<AnkhorageCapabilityName>;
}

export interface ComponentRequirements {
  readonly permissions?: SerializableSet<AnkhoragePermissionName>;
  readonly capabilities?: SerializableSet<AnkhorageCapabilityName>;
}
