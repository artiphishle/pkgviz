import type { AppManifest } from '../types';

export const APP_MANIFEST_KEY_POLICY = {
  metadata: 'required',
  themes: 'required',
  activeThemeId: 'required',
  activeThemeMode: 'optional',
  splashScreen: 'optional',
  media: 'optional',
  deploy: 'optional',
  state: 'optional',
  infra: 'required',
  navigator: 'required',
  screens: 'required',
  dataSources: 'optional',
  dataBindings: 'optional',
  repository: 'optional',
  settings: 'required',
} as const satisfies Record<keyof AppManifest, 'optional' | 'required'>;
