import { isStringArray } from '@ankhorage/utility/array';
import { isRecord } from '@ankhorage/utility/object';

import { isInfraManifest } from '../infra/isInfraManifest';
import type { AppManifest } from '../types';
import { isComponentDataBindingRegistry } from './bindings';
import { APP_MANIFEST_KEY_POLICY } from './constants';
import { isDataSourceRegistry } from './dataSources';
import { isAppDeployManifest } from './deploy';
import { isAppStateSpec } from './isAppStateSpec';
import { isMediaManifest } from './media';
import {
  isAppNavigatorManifest,
  isManifestMetadata,
  isScreenRegistry,
  isSplashScreenSpec,
  isThemeRegistry,
} from './screens';

/*** Return whether an unknown value satisfies the canonical AppManifest shape. */
export function isAppManifest(value: unknown): value is AppManifest {
  return (
    isRecord(value) &&
    hasRequiredManifestKeys(value) &&
    !('generatedApis' in value) &&
    isManifestMetadata(value.metadata) &&
    isPresentation(value) &&
    isOptionalCapabilities(value) &&
    isInfraManifest(value.infra) &&
    isAppNavigatorManifest(value.navigator) &&
    isScreenRegistry(value.screens) &&
    isAppSettings(value.settings)
  );
}

/*** Validate the canonical application manifest field policy. */
function hasRequiredManifestKeys(value: Record<string, unknown>): boolean {
  return Object.entries(APP_MANIFEST_KEY_POLICY).every(
    ([key, policy]) => policy === 'optional' || key in value,
  );
}

/*** Validate the canonical application manifest field policy. */
function isActiveThemeMode(value: unknown): boolean {
  return value === undefined || value === 'dark' || value === 'light';
}

/*** Validate the canonical application manifest field policy. */
function isRepositoryManifest(value: unknown): boolean {
  return (
    isRecord(value) &&
    value.provider === 'github' &&
    typeof value.owner === 'string' &&
    value.owner.length > 0 &&
    typeof value.name === 'string' &&
    value.name.length > 0 &&
    typeof value.url === 'string' &&
    value.url.length > 0 &&
    value.defaultBranch === 'main'
  );
}

/*** Validate the canonical application manifest field policy. */
function isAppSettings(value: unknown): boolean {
  return (
    isRecord(value) &&
    !('apiBaseUrl' in value) &&
    isRecord(value.localization) &&
    typeof value.localization.defaultLocale === 'string' &&
    isStringArray(value.localization.locales)
  );
}

/*** Validate authored appearance as one cohesive manifest concern. */
function isPresentation(value: Record<string, unknown>): boolean {
  return (
    isThemeRegistry(value.themes) &&
    typeof value.activeThemeId === 'string' &&
    Object.hasOwn(value.themes, value.activeThemeId) &&
    isActiveThemeMode(value.activeThemeMode) &&
    (value.splashScreen === undefined || isSplashScreenSpec(value.splashScreen)) &&
    (value.media === undefined || isMediaManifest(value.media))
  );
}

/*** Validate independently optional application capability selections. */
function isOptionalCapabilities(value: Record<string, unknown>): boolean {
  return (
    (value.deploy === undefined || isAppDeployManifest(value.deploy)) &&
    (value.state === undefined || isAppStateSpec(value.state)) &&
    (value.dataSources === undefined || isDataSourceRegistry(value.dataSources)) &&
    (value.dataBindings === undefined || isComponentDataBindingRegistry(value.dataBindings)) &&
    (value.repository === undefined || isRepositoryManifest(value.repository))
  );
}
