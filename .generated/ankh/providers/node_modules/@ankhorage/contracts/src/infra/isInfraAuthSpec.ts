import { isStringArray } from '@ankhorage/utility/array';
import { isRecordOf } from '@ankhorage/utility/object';
import { isOptionalString } from '@ankhorage/utility/string';

import { isIconSpec } from '../appManifest/icon';
import { AUTH_OAUTH_PROVIDER_IDS } from '../auth';
import {
  AUTH_PROFILE_CREATE_STRATEGIES,
  AUTH_PROFILE_PRIMARY_KEY_STRATEGIES,
  AUTH_PROFILE_UPDATE_STRATEGIES,
  AUTH_SCOPES,
  AUTH_SIGN_IN_IDENTIFIERS,
  AUTH_SIGN_UP_POLICIES,
} from '../types';
import type { InfraAuthSpec } from '../types/infraManifest';
import type { InfraShape } from '../types/infraValidation';
import { isInfraShape } from './isInfraShape';

/*** Preserve application auth configuration while rejecting nested authorization and unknown providers. */
export function isInfraAuthSpec(value: unknown): value is InfraAuthSpec {
  return isInfraShape(value, {
    provider: (provider) => provider === 'supabase',
    scope: (scope) => scope === undefined || AUTH_SCOPES.some((item) => item === scope),
    flow: (flow) => flow === undefined || isAuthFlow(flow),
    signIn: (signIn) =>
      signIn === undefined ||
      isInfraShape(signIn, {
        identifiers: (ids) =>
          Array.isArray(ids) &&
          ids.every((id) => AUTH_SIGN_IN_IDENTIFIERS.some((item) => item === id)),
      }),
    signUp: (signUp) => signUp === undefined || isAuthSignUp(signUp),
    oauth: (oauth) => oauth === undefined || isAuthOAuth(oauth),
    profile: (profile) => profile === undefined || isAuthProfile(profile),
  } satisfies InfraShape<InfraAuthSpec>);
}

/*** Auth routing intent stays separate from provider-runtime callbacks and Navigator topology. */
function isAuthFlow(value: unknown): boolean {
  return isInfraShape(value, {
    signInRoute: (route) => typeof route === 'string',
    postSignInRoute: (route) => typeof route === 'string',
    signUpRoute: isOptionalString,
    signOutRoute: isOptionalString,
    forgotPasswordRoute: isOptionalString,
    otpRoute: isOptionalString,
    unauthorizedRoute: isOptionalString,
  });
}

/*** Validate sign-up field intent using the existing application auth contract. */
function isAuthSignUp(value: unknown): boolean {
  return isInfraShape(value, {
    requiredFields: isStringArray,
    optionalFields: (fields) => fields === undefined || isStringArray(fields),
    signUpPolicy: (policy) =>
      policy === undefined || AUTH_SIGN_UP_POLICIES.some((item) => item === policy),
  });
}

/*** OAuth references contain no credential payload. Custom OAuth identities remain application-owned. */
function isAuthOAuth(value: unknown): boolean {
  return isInfraShape(value, {
    enabled: (enabled) => typeof enabled === 'boolean',
    callbackRoute: (route) => typeof route === 'string',
    providers: (providers) => Array.isArray(providers) && providers.every(isAuthOAuthProvider),
  });
}

/*** Validate OAuth display/config metadata, preserving explicitly extensible OAuth provider IDs. */
function isAuthOAuthProvider(value: unknown): boolean {
  return isInfraShape(value, {
    id: (id) =>
      typeof id === 'string' &&
      (AUTH_OAUTH_PROVIDER_IDS.some((item) => item === id) || id.length > 0),
    label: isOptionalString,
    enabled: (value) => value === undefined || typeof value === 'boolean',
    scopes: (scopes) => scopes === undefined || isStringArray(scopes),
    queryParams: (params) =>
      params === undefined || isRecordOf(params, (entry) => typeof entry === 'string'),
    icon: (icon) => icon === undefined || isIconSpec(icon),
    credentialsRef: isOptionalString,
  });
}

/*** Validate profile provisioning choices without inventing a new application profile model. */
function isAuthProfile(value: unknown): boolean {
  return isInfraShape(value, {
    fields: isStringArray,
    table: isOptionalString,
    primaryKey: (key) =>
      key === undefined || AUTH_PROFILE_PRIMARY_KEY_STRATEGIES.some((item) => item === key),
    createStrategy: (strategy) =>
      strategy === undefined || AUTH_PROFILE_CREATE_STRATEGIES.some((item) => item === strategy),
    updateStrategy: (strategy) =>
      strategy === undefined || AUTH_PROFILE_UPDATE_STRATEGIES.some((item) => item === strategy),
  });
}
