import { describe, expect, it } from 'bun:test';

import type { AppManifest, SplashScreenSpec } from '../index';

describe('AppManifest splash screen contract', () => {
  it('accepts portable media references with the canonical splash option shape', () => {
    const splashScreen: SplashScreenSpec = {
      backgroundColor: '#ffffff',
      image: { mediaId: 'splash-logo' },
      imageWidth: 160,
      resizeMode: 'contain',
      dark: {
        backgroundColor: '#000000',
        image: { mediaId: 'splash-logo-dark' },
      },
    };

    const manifest: Pick<AppManifest, 'splashScreen'> = { splashScreen };

    expect(JSON.parse(JSON.stringify(manifest))).toEqual({ splashScreen });
  });

  it('keeps root-only Expo options out of dark-mode overrides', () => {
    const splashWithDarkImageWidth: SplashScreenSpec = {
      dark: {
        // @ts-expect-error Dark-mode overrides do not include image sizing.
        imageWidth: 160,
      },
    };
    const splashWithDarkResizeMode: SplashScreenSpec = {
      dark: {
        // @ts-expect-error Dark-mode overrides do not include resize mode.
        resizeMode: 'contain',
      },
    };

    expect(splashWithDarkImageWidth.dark).toEqual({ imageWidth: 160 });
    expect(splashWithDarkResizeMode.dark).toEqual({ resizeMode: 'contain' });
  });
});
