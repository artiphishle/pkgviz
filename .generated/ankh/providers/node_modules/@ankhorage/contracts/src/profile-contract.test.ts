import { describe, expect, it } from 'bun:test';

import {
  AUTH_PROFILE_CREATE_STRATEGIES,
  AUTH_PROFILE_PRIMARY_KEY_STRATEGIES,
  AUTH_PROFILE_UPDATE_STRATEGIES,
  type InfraAuthSpec,
} from './index';

describe('profile contract', () => {
  it('exports profile strategy lists', () => {
    expect(AUTH_PROFILE_PRIMARY_KEY_STRATEGIES).toEqual(['authUserId']);
    expect(AUTH_PROFILE_CREATE_STRATEGIES).toEqual(['trigger', 'api', 'app']);
    expect(AUTH_PROFILE_UPDATE_STRATEGIES).toEqual(['api', 'app']);
  });

  it('serializes profile settings on an auth spec', () => {
    const auth: InfraAuthSpec = {
      scope: 'global',
      provider: 'supabase',
      profile: {
        fields: ['email', 'displayName', 'avatarUrl'],
        table: 'profiles',
        primaryKey: 'authUserId',
        createStrategy: 'trigger',
        updateStrategy: 'api',
      },
    };

    expect(JSON.parse(JSON.stringify(auth))).toEqual(auth);
  });
});
