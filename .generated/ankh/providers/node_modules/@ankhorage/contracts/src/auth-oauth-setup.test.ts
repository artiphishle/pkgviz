import { describe, expect, it } from 'bun:test';

import {
  AUTH_OAUTH_SETUP_CALLBACK_ROLES,
  AUTH_OAUTH_SETUP_FIELD_PERSISTENCE_KINDS,
  AUTH_OAUTH_SETUP_FIELD_SENSITIVITIES,
  AUTH_OAUTH_TRANSPORT_IDS,
  type AuthOAuthSetupPlan,
  type AuthOAuthTransportId,
} from './auth';

describe('OAuth setup requirement contracts', () => {
  it('models target and environment aware requirements without credential values', () => {
    const plan: AuthOAuthSetupPlan = {
      provider: 'google',
      transport: 'brokeredRedirect',
      environment: 'local',
      targets: ['web', 'ios', 'android'],
      requirements: [
        {
          kind: 'field',
          key: 'webClientId',
          label: 'Web Client ID',
          required: true,
          sensitivity: 'public',
          persistence: 'trustedCredential',
        },
        {
          kind: 'field',
          key: 'webClientSecret',
          label: 'Web Client Secret',
          required: true,
          sensitivity: 'secret',
          persistence: 'trustedCredential',
        },
        {
          kind: 'callback',
          role: 'provider',
          label: 'Provider callback URI',
          required: true,
        },
        {
          kind: 'callback',
          role: 'app',
          target: 'ios',
          label: 'iOS app callback',
          required: true,
        },
      ],
    };

    expect(AUTH_OAUTH_TRANSPORT_IDS).toEqual(['brokeredRedirect']);
    expect(AUTH_OAUTH_SETUP_FIELD_PERSISTENCE_KINDS).toEqual(['trustedCredential', 'publicConfig']);
    expect(AUTH_OAUTH_SETUP_FIELD_SENSITIVITIES).toEqual(['public', 'secret']);
    expect(AUTH_OAUTH_SETUP_CALLBACK_ROLES).toEqual(['provider', 'app']);
    expect(plan.environment).toBe('local');
    expect(plan.targets).toEqual(['web', 'ios', 'android']);
    expect(plan.requirements.filter((requirement) => requirement.kind === 'field')).toHaveLength(2);
    expect(JSON.stringify(plan)).not.toContain('credentialValue');
  });

  it('keeps transport identifiers extensible for later native capabilities', () => {
    const futureTransport: AuthOAuthTransportId = 'nativeIdToken';

    expect(futureTransport).toBe('nativeIdToken');
    expect(AUTH_OAUTH_TRANSPORT_IDS).not.toContain(futureTransport);
  });
});
