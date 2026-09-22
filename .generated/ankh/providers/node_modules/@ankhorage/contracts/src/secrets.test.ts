import { describe, expect, test } from 'bun:test';

import type { AuthOAuthProviderConfig } from './auth';
import type { InfraManifest } from './infra';
import {
  findForbiddenInlineSecretFields,
  normalizeSecretRef,
  normalizeSecretScope,
  validateSecretPayload,
} from './secrets';

describe('secret-store contracts', () => {
  test('normalizes logical secret references', () => {
    expect(normalizeSecretRef('/auth//oauth/google/')).toEqual({
      ok: true,
      data: 'auth/oauth/google',
    });
  });

  test('rejects invalid secret references', () => {
    expect(normalizeSecretRef('Auth OAuth/Google')).toEqual({
      ok: false,
      error: {
        code: 'invalid_reference',
        message:
          'Secret reference must contain lowercase path segments using letters, numbers, dots, underscores, or hyphens.',
      },
    });
  });

  test('normalizes project and environment scope', () => {
    expect(normalizeSecretScope({ projectId: ' scanner ', environment: ' local ' })).toEqual({
      ok: true,
      data: { projectId: 'scanner', environment: 'local' },
    });
  });

  test('validates non-empty string payloads without exposing values', () => {
    expect(validateSecretPayload({ clientId: 'id', clientSecret: 'secret' })).toEqual({
      ok: true,
      data: { clientId: 'id', clientSecret: 'secret' },
    });

    const result = validateSecretPayload({ clientSecret: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_payload');
      expect(result.error.message).not.toContain('secret-value');
    }
  });

  test('detects forbidden inline secret fields in manifest-shaped provider config', () => {
    expect(
      findForbiddenInlineSecretFields({
        id: 'google',
        credentialsRef: 'auth/oauth/google',
        clientSecret: 'sentinel-secret-value',
      }),
    ).toEqual(['clientSecret']);
  });

  test('supports OAuth credential references and canonical infra provider selection', () => {
    const provider: AuthOAuthProviderConfig = {
      id: 'google',
      enabled: true,
      credentialsRef: 'auth/oauth/google',
    };

    const infra: InfraManifest = {
      modules: {},
      environments: {
        local: {
          deployment: { compute: { provider: 'local' }, runtime: { provider: 'minikube' } },
          database: { provider: 'supabase' },
          secretStore: { provider: 'supabase-vault' },
          auth: {
            scope: 'global',
            provider: 'supabase',
            oauth: {
              enabled: true,
              callbackRoute: '/auth/callback',
              providers: [provider],
            },
          },
        },
      },
    };

    expect(infra.environments.local.secretStore?.provider).toBe('supabase-vault');
    expect(infra.environments.local.auth?.oauth?.providers[0]?.credentialsRef).toBe(
      'auth/oauth/google',
    );
  });
});
