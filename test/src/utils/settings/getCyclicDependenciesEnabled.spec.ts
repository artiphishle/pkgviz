import { describe, expect, it } from '@artiphishle/testosterone';

import { getCyclicDependenciesEnabled } from '@/utils/settings/getCyclicDependenciesEnabled';

describe('[getCyclicDependenciesEnabled]', () => {
  it('defaults cyclic-dependencies visualization to enabled', () => {
    delete process.env.NEXT_PUBLIC_SETTINGS_RULE_CYCLIC_DEPENDENCIES_ENABLED;
    expect(getCyclicDependenciesEnabled()).toBe(true);
  });

  it('allows cyclic-dependencies visualization to be disabled through ENV', () => {
    process.env.NEXT_PUBLIC_SETTINGS_RULE_CYCLIC_DEPENDENCIES_ENABLED = 'false';
    expect(getCyclicDependenciesEnabled()).toBe(false);
  });
});
