export const APP_DEPLOY_TARGET_IDS = ['web', 'android', 'ios'] as const;

export type AppDeployTargetId = (typeof APP_DEPLOY_TARGET_IDS)[number];

export interface AppDeployProviderSelection {
  readonly build?: string;
  readonly publish?: string;
}

export interface AppDeployWebTargetConfig {
  readonly enabled: boolean;
  readonly providers?: AppDeployProviderSelection;
}

export interface AppDeployAndroidTargetConfig {
  readonly enabled: boolean;
  readonly package: string;
  /** Stable application URI scheme used for target-aware deep links such as OAuth callbacks. */
  readonly scheme?: string;
  readonly providers?: AppDeployProviderSelection;
}

export interface AppDeployIosTargetConfig {
  readonly enabled: boolean;
  readonly bundleIdentifier: string;
  /** Stable application URI scheme used for target-aware deep links such as OAuth callbacks. */
  readonly scheme?: string;
  readonly providers?: AppDeployProviderSelection;
}

export interface AppDeployTargets {
  readonly web?: AppDeployWebTargetConfig;
  readonly android?: AppDeployAndroidTargetConfig;
  readonly ios?: AppDeployIosTargetConfig;
}

export interface AppDeployManifest {
  readonly targets: AppDeployTargets;
}

export { isAppDeployManifest } from './appManifest/deploy.js';
