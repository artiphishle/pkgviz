import type { MediaAssetReference } from '../media';

export type SplashScreenResizeMode = 'contain' | 'cover' | 'native';

export interface SplashScreenModeSpec {
  readonly backgroundColor?: string;
  readonly image?: MediaAssetReference;
}

export interface SplashScreenSpec extends SplashScreenModeSpec {
  readonly imageWidth?: number;
  readonly resizeMode?: SplashScreenResizeMode;
  readonly dark?: SplashScreenModeSpec;
}
