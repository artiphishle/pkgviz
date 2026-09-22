import { COLOR_HARMONIES } from '@ankhorage/color-theory';
import { isRecord } from '@ankhorage/utility/object';
import { isOptionalString } from '@ankhorage/utility/string';

import { isSerializableSet } from '../collections';
import { isMediaAssetReference } from '../media';
import { ANKHORAGE_CAPABILITY_NAMES, ANKHORAGE_PERMISSION_NAMES } from '../requirements';
import { APP_CATEGORIES, type ThemeRegistry } from '../types';
import { isBindingValueSource, isScreenDataLoaderDefinition } from './bindings';

export { isAppNavigatorManifest } from './navigator';

const APP_CATEGORY_SET = new Set<string>(APP_CATEGORIES);
const COLOR_HARMONY_SET = new Set<string>(COLOR_HARMONIES);
const SPLASH_SCREEN_RESIZE_MODE_SET = new Set<string>(['contain', 'cover', 'native']);
const PERMISSION_NAME_SET = new Set<string>(ANKHORAGE_PERMISSION_NAMES);
const CAPABILITY_NAME_SET = new Set<string>(ANKHORAGE_CAPABILITY_NAMES);

/*** Validate application identity and optional authored metadata. */
export function isManifestMetadata(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.version === 'string' &&
    typeof value.category === 'string' &&
    APP_CATEGORY_SET.has(value.category) &&
    typeof value.themeId === 'string' &&
    isOptionalString(value.created) &&
    isOptionalString(value.updated)
  );
}

/*** Validate theme identity and its required light and dark modes. */
function isThemeConfig(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isThemeModeConfig(value.light) &&
    isThemeModeConfig(value.dark)
  );
}

/*** Validate themes in the authored theme registry and require registry keys to match theme identity. */
export function isThemeRegistry(value: unknown): value is ThemeRegistry {
  return (
    isRecord(value) &&
    Object.entries(value).every(
      ([registryKey, theme]) => isThemeConfig(theme) && isRecord(theme) && registryKey === theme.id,
    )
  );
}

/*** Validate screens in the authored screen registry. */
export function isScreenRegistry(value: unknown): boolean {
  return (
    isRecord(value) &&
    Object.entries(value).every(
      ([registryKey, screen]) =>
        isScreenSpec(screen) && isRecord(screen) && registryKey === screen.id,
    )
  );
}

/*** Validate optional light and dark splash-screen configuration. */
export function isSplashScreenSpec(value: unknown): boolean {
  return (
    isSplashScreenModeSpec(value) &&
    isRecord(value) &&
    (value.dark === undefined || isSplashScreenModeSpec(value.dark))
  );
}

/*** Validate the primary color and supported color harmony of a theme mode. */
function isThemeModeConfig(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.primaryColor === 'string' &&
    typeof value.harmony === 'string' &&
    COLOR_HARMONY_SET.has(value.harmony)
  );
}

/*** Validate an authored component node and its nested children. */
function isUiNode(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.type === 'string' &&
    isOptionalString(value.alias) &&
    (value.props === undefined || isRecord(value.props)) &&
    (value.style === undefined || isRecord(value.style)) &&
    (value.repeat === undefined || isUiNodeRepeatSpec(value.repeat)) &&
    (value.children === undefined ||
      (Array.isArray(value.children) && value.children.every(isUiNode)))
  );
}

/*** Validate repeat source and item binding configuration. */
function isUiNodeRepeatSpec(value: unknown): boolean {
  return (
    isRecord(value) &&
    isBindingValueSource(value.source) &&
    isOptionalString(value.itemAlias) &&
    isOptionalString(value.keyPath) &&
    (value.empty === undefined || (Array.isArray(value.empty) && value.empty.every(isUiNode)))
  );
}

/*** Validate screen identity, root component and optional requirements. */
function isScreenSpec(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isOptionalString(value.title) &&
    isOptionalString(value.description) &&
    (value.dataLoaders === undefined ||
      (Array.isArray(value.dataLoaders) &&
        value.dataLoaders.every(isScreenDataLoaderDefinition))) &&
    (value.requires === undefined || isScreenRequirements(value.requires)) &&
    isUiNode(value.root)
  );
}

/*** Validate one splash-screen appearance configuration. */
function isSplashScreenModeSpec(value: unknown): boolean {
  return (
    isRecord(value) &&
    (value.image === undefined || isMediaAssetReference(value.image)) &&
    (value.imageWidth === undefined || typeof value.imageWidth === 'number') &&
    (value.resizeMode === undefined ||
      (typeof value.resizeMode === 'string' &&
        SPLASH_SCREEN_RESIZE_MODE_SET.has(value.resizeMode))) &&
    isOptionalString(value.backgroundColor)
  );
}

/*** Validate screen capability and permission requirements. */
function isScreenRequirements(value: unknown): boolean {
  return (
    isRecord(value) &&
    (value.permissions === undefined || isRequirementSet(value.permissions, PERMISSION_NAME_SET)) &&
    (value.capabilities === undefined || isRequirementSet(value.capabilities, CAPABILITY_NAME_SET))
  );
}

/*** Validate unordered requirement membership against the supported capability or permission names. */
function isRequirementSet(value: unknown, allowedNames: ReadonlySet<string>): boolean {
  return isSerializableSet(value) && Object.keys(value).every((name) => allowedNames.has(name));
}
