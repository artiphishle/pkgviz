import { isStringArray } from '@ankhorage/utility/array';
import { hasOnlyKeys, isRecord } from '@ankhorage/utility/object';
import { isOptionalString } from '@ankhorage/utility/string';

import { type AppNavigatorManifest, NAVIGATOR_PRESETS, NAVIGATOR_TYPES } from '../navigator';
import { isIconSpec } from './icon';
import {
  isDrawerNavigatorOptions,
  isNavigatorScreenReference,
  isStackImplementationConfig,
  isStackScreenOptions,
  isTabsImplementationConfig,
} from './navigatorOptions';

/*** Validate the complete serialized `AppManifest.navigator` slice. */
export function isAppNavigatorManifest(value: unknown): value is AppNavigatorManifest {
  return (
    isRecord(value) &&
    isNavigatorNode(value) &&
    (value.preset === undefined ||
      (typeof value.preset === 'string' && hasNavigatorPreset(value.preset))) &&
    value.flows === undefined &&
    (value.defaults === undefined || isNavigatorDefaults(value.defaults)) &&
    (value.platforms === undefined || isNavigatorPlatforms(value.platforms))
  );
}

/*** Validate one nested navigator node independently from app-level authoring metadata. */
function isNavigatorNode(value: unknown): boolean {
  if (
    !isRecord(value) ||
    typeof value.type !== 'string' ||
    !hasNavigatorType(value.type) ||
    !isOptionalString(value.initialRouteName) ||
    !Array.isArray(value.routes) ||
    !value.routes.every(isRouteDefinition)
  ) {
    return false;
  }

  switch (value.type) {
    case 'slot':
      return value.options === undefined && value.implementation === undefined;
    case 'stack':
      return isStackImplementationConfig(value);
    case 'tabs':
      return isTabsImplementationConfig(value);
    case 'drawer':
      return (
        value.implementation === undefined &&
        (value.options === undefined || isDrawerNavigatorOptions(value.options))
      );
    case 'split-view':
      return isSplitViewNavigatorNode(value);
    case 'custom':
      return isCustomNavigatorNode(value);
    default:
      return false;
  }
}

/*** Check a serialized preset against the public contract without eager cyclic initialization. */
function hasNavigatorPreset(value: string): boolean {
  return (NAVIGATOR_PRESETS as readonly string[]).includes(value);
}

/*** Check a serialized topology against the public contract without eager cyclic initialization. */
function hasNavigatorType(value: string): boolean {
  return (NAVIGATOR_TYPES as readonly string[]).includes(value);
}

/*** Validate one route and preserve its portable metadata and nested navigator. */
function isRouteDefinition(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    [value.path, value.label, value.screenId].every(isOptionalString) &&
    (value.icon === undefined || isIconSpec(value.icon)) &&
    (value.showInPrimaryNavigation === undefined ||
      typeof value.showInPrimaryNavigation === 'boolean') &&
    (value.guards === undefined || isStringArray(value.guards)) &&
    (value.stackOptions === undefined || isStackScreenOptions(value.stackOptions)) &&
    (value.navigator === undefined || isNavigatorNode(value.navigator))
  );
}

/*** Validate Split View screen references without duplicating the routed secondary tree. */
function isSplitViewNavigatorNode(value: Record<string, unknown>): boolean {
  return (
    value.implementation === undefined &&
    value.options === undefined &&
    isRecord(value.columns) &&
    hasOnlyKeys(value.columns, ['primary', 'supplementary']) &&
    isNavigatorScreenReference(value.columns.primary) &&
    (value.columns.supplementary === undefined ||
      isNavigatorScreenReference(value.columns.supplementary)) &&
    (value.inspector === undefined || isNavigatorScreenReference(value.inspector)) &&
    (value.topColumnForCollapsing === undefined ||
      value.topColumnForCollapsing === 'primary' ||
      value.topColumnForCollapsing === 'supplementary' ||
      value.topColumnForCollapsing === 'secondary')
  );
}

/*** Validate a registered custom navigator with JSON-safe configuration only. */
function isCustomNavigatorNode(value: Record<string, unknown>): boolean {
  return (
    value.implementation === undefined &&
    value.options === undefined &&
    typeof value.navigatorId === 'string' &&
    (value.config === undefined || isNavigatorJsonRecord(value.config))
  );
}

/*** Validate an acyclic, finite JSON object used by a custom navigator adapter. */
function isNavigatorJsonRecord(value: unknown): boolean {
  return isRecord(value) && isNavigatorJsonValue(value, new Set<object>());
}

/*** Recursively validate the portable manifest value domain and reject cycles. */
function isNavigatorJsonValue(value: unknown, ancestors: Set<object>): boolean {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value !== 'object' || ancestors.has(value)) return false;

  if (Array.isArray(value)) {
    if (
      Object.keys(value).length !== value.length ||
      Object.getOwnPropertySymbols(value).length > 0
    ) {
      return false;
    }
  } else {
    const prototype = Object.getPrototypeOf(value) as object | null;
    if (prototype !== Object.prototype && prototype !== null) return false;
    if (Reflect.ownKeys(value).some((key) => typeof key !== 'string')) return false;
  }

  ancestors.add(value);
  const isValid = Object.values(value).every((entry) => isNavigatorJsonValue(entry, ancestors));
  ancestors.delete(value);
  return isValid;
}

/*** Validate package-owned navigator defaults without requiring a navigator node type. */
function isNavigatorDefaults(value: unknown): boolean {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ['tabs', 'stack']) &&
    (value.tabs === undefined ||
      (isRecord(value.tabs) && isTabsImplementationConfig(value.tabs))) &&
    (value.stack === undefined ||
      (isRecord(value.stack) && isStackImplementationConfig(value.stack)))
  );
}

/*** Validate per-platform navigator implementation overrides. */
function isNavigatorPlatforms(value: unknown): boolean {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ['android', 'ios', 'web']) &&
    (value.android === undefined || isNavigatorPlatformConfig(value.android)) &&
    (value.ios === undefined || isNavigatorPlatformConfig(value.ios)) &&
    (value.web === undefined || isNavigatorPlatformConfig(value.web))
  );
}

/*** Validate one platform-specific navigator override slice. */
function isNavigatorPlatformConfig(value: unknown): boolean {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ['tabs', 'stack']) &&
    (value.tabs === undefined ||
      (isRecord(value.tabs) && isTabsImplementationConfig(value.tabs))) &&
    (value.stack === undefined ||
      (isRecord(value.stack) && isStackImplementationConfig(value.stack)))
  );
}
