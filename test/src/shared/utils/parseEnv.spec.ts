import { describe, expect, it } from '@artiphishle/testosterone';
import { getCyclicDependenciesRuleEnabled, parseEnv } from '@/shared/utils/parseEnv';

describe('[parseEnv]', () => {
  it('parses "" correctly to undefined', () => {
    process.env.NEXT_PUBLIC_TEST = '';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    expect(result).toBeUndefined();
  });

  // Parse 'false' to boolean
  it('parses "false" correctly to boolean', () => {
    process.env.NEXT_PUBLIC_TEST = 'false';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    expect(result).toBe(false);
  });

  // Parse 'true' to boolean
  it('parses "true" correctly to boolean', () => {
    process.env.NEXT_PUBLIC_TEST = 'true';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    expect(result).toBe(true);
  });

  it('parses a number correctly', () => {
    process.env.NEXT_PUBLIC_TEST = '123';

    const result = parseEnv('test', process.env.NEXT_PUBLIC_TEST);
    expect(result).toBe(123);
  });

  it('uses NEXT_PUBLIC_SETTINGS_RULE_CYCLIC_DEPENDENCIES_ENABLED as the rule default', () => {
    const previous = process.env.NEXT_PUBLIC_SETTINGS_RULE_CYCLIC_DEPENDENCIES_ENABLED;

    process.env.NEXT_PUBLIC_SETTINGS_RULE_CYCLIC_DEPENDENCIES_ENABLED = 'false';
    expect(getCyclicDependenciesRuleEnabled()).toBe(false);

    process.env.NEXT_PUBLIC_SETTINGS_RULE_CYCLIC_DEPENDENCIES_ENABLED = 'true';
    expect(getCyclicDependenciesRuleEnabled()).toBe(true);

    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_SETTINGS_RULE_CYCLIC_DEPENDENCIES_ENABLED;
    } else {
      process.env.NEXT_PUBLIC_SETTINGS_RULE_CYCLIC_DEPENDENCIES_ENABLED = previous;
    }
  });
});
