import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { describe, expect, it } from 'bun:test';

import {
  type AppSettings,
  type AuthFlowConfig,
  type AuthProviderConfig,
  DEFAULT_AUTH_FLOW,
  type InfraAuthSpec,
  resolveAuthFlow,
} from './index';

async function collectTypeScriptFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTypeScriptFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(path);
    }
  }

  return files;
}

describe('canonical authentication flow contract', () => {
  it('resolves one canonical default without mutating shared state', () => {
    const first = resolveAuthFlow();
    const second = resolveAuthFlow();

    expect(first).toEqual(DEFAULT_AUTH_FLOW);
    expect(second).toEqual(DEFAULT_AUTH_FLOW);
    expect(first).not.toBe(DEFAULT_AUTH_FLOW);
    expect(second).not.toBe(first);
  });

  it('preserves an explicitly configured flow without inventing optional routes', () => {
    const configured: AuthFlowConfig = {
      signInRoute: 'login',
      postSignInRoute: 'dashboard',
    };
    const resolved = resolveAuthFlow(configured);

    expect(resolved).toEqual(configured);
    expect(resolved).not.toBe(configured);
    expect(resolved.signUpRoute).toBeUndefined();
  });

  it('allows authentication without an authorization model', () => {
    const auth: InfraAuthSpec = {
      scope: 'global',
      provider: 'supabase',
      flow: DEFAULT_AUTH_FLOW,
    };

    expect(Object.hasOwn(auth, 'authorization')).toBe(false);
  });

  it('removes auth flow from application settings at compile time', () => {
    const settings: AppSettings = {
      localization: {
        defaultLocale: 'en',
        locales: ['en'],
      },
    };

    const removedProperty = {
      localization: settings.localization,
      // @ts-expect-error Authentication flow no longer belongs in application settings.
      authFlow: DEFAULT_AUTH_FLOW,
    } satisfies AppSettings;

    expect(removedProperty.localization).toEqual(settings.localization);
  });

  it('keeps provider runtime config free of manifest auth flow', () => {
    const removedProperty = {
      provider: 'supabase',
      signIn: {
        identifiers: ['email'],
      },
      // @ts-expect-error Auth flow belongs only on AuthSpec.flow.
      flow: DEFAULT_AUTH_FLOW,
    } satisfies AuthProviderConfig;

    expect(removedProperty.provider).toBe('supabase');
  });

  it('removes nested authorization from the authentication contract', () => {
    const hasAuthorization: 'authorization' extends keyof InfraAuthSpec ? true : false = false;
    expect(hasAuthorization).toBe(false);
  });

  it('prevents the removed settings auth-flow path from returning to source', async () => {
    const removedPath = 'settings.' + 'authFlow';
    const files = await collectTypeScriptFiles(join(process.cwd(), 'src'));

    for (const file of files) {
      if (basename(file) === 'auth-flow-contract.test.ts') continue;
      const content = await readFile(file, 'utf8');
      expect(content.includes(removedPath)).toBe(false);
    }
  });
});
