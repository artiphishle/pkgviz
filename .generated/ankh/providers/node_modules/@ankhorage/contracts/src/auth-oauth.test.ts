import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'bun:test';

import {
  AUTH_OAUTH_CANCELLATION_REASONS,
  AUTH_OAUTH_ERROR_CODES,
  AUTH_OAUTH_PROVIDER_IDS,
  type AuthAdapter,
  type AuthOAuthConfig,
  type AuthSession,
  type InfraAuthSpec,
} from './index';

const session: AuthSession = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: {
    id: 'user-1',
    email: 'person@example.com',
  },
};

function createBaseAdapter(): Omit<AuthAdapter, 'oauth'> {
  return {
    capabilities: {
      signInIdentifiers: ['email'],
      supportsSignUp: true,
      supportsPasswordReset: true,
      supportsOtp: true,
      supportsSessionRefresh: true,
    },
    signIn() {
      return Promise.resolve({
        ok: false,
        error: { code: 'unsupported', message: 'Password sign-in is not implemented.' },
      });
    },
    signUp() {
      return Promise.resolve({
        ok: false,
        error: { code: 'unsupported', message: 'Sign-up is not implemented.' },
      });
    },
    signOut() {
      return Promise.resolve({ ok: true });
    },
    getSession() {
      return Promise.resolve({ ok: true, data: null });
    },
  };
}

describe('OAuth auth contracts', () => {
  it('accepts provider-neutral OAuth provider config on auth specs', () => {
    const oauth: AuthOAuthConfig = {
      enabled: true,
      callbackRoute: '/auth/callback',
      providers: [
        {
          id: 'google',
          label: 'Google',
          enabled: true,
          scopes: ['openid', 'email', 'profile'],
          icon: {
            provider: 'FontAwesome',
            name: 'google',
          },
        },
        {
          id: 'custom-sso',
          label: 'Custom SSO',
          enabled: false,
          queryParams: {
            prompt: 'select_account',
          },
        },
      ],
    };

    const auth: InfraAuthSpec = {
      scope: 'global',
      provider: 'supabase',
      oauth,
    };

    expect(AUTH_OAUTH_PROVIDER_IDS.includes('google')).toBe(true);
    expect(auth.oauth?.providers[0]?.icon?.name).toBe('google');
    expect(auth.oauth?.providers[1]?.id).toBe('custom-sso');
    expect(auth.oauth?.providers[1]?.enabled).toBe(false);
  });

  it('advertises OAuth only through one complete start and completion capability', async () => {
    const adapter: AuthAdapter = {
      ...createBaseAdapter(),
      oauth: {
        capabilities: {
          providers: ['google', 'custom-sso'],
        },
        startAuthorization(input) {
          return Promise.resolve({
            ok: true,
            data: {
              attemptId: 'oauth-attempt-1',
              provider: input.provider,
              authorizationUrl: `https://auth.example.com/oauth/${input.provider}`,
              redirectUri: input.redirectUri,
            },
          });
        },
        completeAuthorization(input) {
          if (input.response.type === 'cancelled') {
            return Promise.resolve({
              ok: false,
              status: 'cancelled',
              provider: 'google',
              reason: input.response.reason,
            });
          }

          if (input.response.type === 'error') {
            return Promise.resolve({
              ok: false,
              status: 'error',
              error: {
                code: 'authorization_failed',
                message: input.response.error.message,
                stage: 'transport',
                provider: 'google',
                recoverable: true,
              },
            });
          }

          return Promise.resolve({
            ok: true,
            status: 'authenticated',
            provider: 'google',
            session,
          });
        },
      },
    };

    const started = await adapter.oauth?.startAuthorization({
      provider: 'google',
      redirectUri: 'ankh-app://auth/callback',
      scopes: ['openid', 'email', 'profile'],
      queryParams: { prompt: 'select_account' },
    });

    expect(adapter.oauth?.capabilities.providers).toEqual(['google', 'custom-sso']);
    expect(started?.ok).toBe(true);
    expect(started?.ok === true ? started.data.attemptId : undefined).toBe('oauth-attempt-1');
    expect(started?.ok === true ? started.data.redirectUri : undefined).toBe(
      'ankh-app://auth/callback',
    );

    const completed = await adapter.oauth?.completeAuthorization({
      attemptId: 'oauth-attempt-1',
      response: {
        type: 'callback',
        url: 'ankh-app://auth/callback?code=opaque-code&state=opaque-state',
      },
    });

    expect(completed?.status).toBe('authenticated');
    expect(completed?.ok === true ? completed.session : undefined).toEqual(session);
  });

  it('models user cancellation separately from OAuth failures', async () => {
    const adapter: AuthAdapter = {
      ...createBaseAdapter(),
      oauth: {
        capabilities: { providers: ['google'] },
        startAuthorization(input) {
          return Promise.resolve({
            ok: true,
            data: {
              attemptId: 'oauth-attempt-2',
              provider: input.provider,
              authorizationUrl: 'https://auth.example.com/oauth/google',
              redirectUri: input.redirectUri,
            },
          });
        },
        completeAuthorization(input) {
          if (input.response.type === 'cancelled') {
            return Promise.resolve({
              ok: false,
              status: 'cancelled',
              provider: 'google',
              reason: input.response.reason,
            });
          }

          return Promise.resolve({
            ok: false,
            status: 'error',
            error: {
              code: 'invalid_callback',
              message: 'The OAuth callback is invalid.',
              stage: 'callback',
              provider: 'google',
              recoverable: true,
            },
          });
        },
      },
    };

    const cancelled = await adapter.oauth?.completeAuthorization({
      attemptId: 'oauth-attempt-2',
      response: { type: 'cancelled', reason: 'browser_dismissed' },
    });

    expect(AUTH_OAUTH_CANCELLATION_REASONS).toContain('provider_denied');
    expect(AUTH_OAUTH_ERROR_CODES).toContain('pkce_mismatch');
    expect(cancelled).toEqual({
      ok: false,
      status: 'cancelled',
      provider: 'google',
      reason: 'browser_dismissed',
    });
  });

  it('removes the superseded URL-only OAuth adapter surface', () => {
    const source = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), 'auth.ts'),
      'utf8',
    );
    const removedSymbols = [
      'SignInWith' + 'OAuthInput',
      'AuthOAuth' + 'Redirect',
      'CompleteOAuth' + 'SignInInput',
      'signInWith' + 'OAuth',
      'completeOAuth' + 'SignIn',
      'supports' + 'OAuth',
      'oauth' + 'Providers',
    ];

    for (const symbol of removedSymbols) {
      expect(source).not.toContain(symbol);
    }
  });
});
