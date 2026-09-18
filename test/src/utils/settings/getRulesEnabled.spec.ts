import { describe, expect, it } from '@artiphishle/testosterone';

import { getRulesEnabled } from '@/utils/settings/getRulesEnabled';

describe('[getRulesEnabled]', () => {
  it('defaults rule visualization to enabled', () => {
    delete process.env.NEXT_PUBLIC_SETTINGS_RULES_ENABLED;
    expect(getRulesEnabled()).toBe(true);
  });

  it('allows rule visualization to be disabled through ENV', () => {
    process.env.NEXT_PUBLIC_SETTINGS_RULES_ENABLED = 'false';
    expect(getRulesEnabled()).toBe(false);
  });
});
