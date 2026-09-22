import { describe, expect, it } from 'bun:test';

import { resolveTabElementId } from './resolveTabElementId';

describe('resolveTabElementId', () => {
  it('creates stable ids from tab values', () => {
    expect(resolveTabElementId('tab', undefined, 'Account Settings')).toBe(
      'tabs-tab-Account-Settings',
    );
    expect(resolveTabElementId('panel', undefined, 'Account Settings')).toBe(
      'tabs-panel-Account-Settings',
    );
  });

  it('namespaces ids by tabs testID when provided', () => {
    expect(resolveTabElementId('tab', 'settings', 'billing')).toBe('settings-tabs-tab-billing');
    expect(resolveTabElementId('panel', 'settings', 'billing')).toBe('settings-tabs-panel-billing');
  });
});
