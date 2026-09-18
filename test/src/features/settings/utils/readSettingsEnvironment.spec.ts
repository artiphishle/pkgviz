import { describe, expect, it } from '@artiphishle/testosterone';

import { readSettingsEnvironment } from '@/features/settings/utils/readSettingsEnvironment';

const SETTINGS_ENV_NAMES = [
  'NEXT_PUBLIC_SETTINGS_LAYOUT',
  'NEXT_PUBLIC_SETTINGS_LAYOUT_SPACING',
  'NEXT_PUBLIC_SETTINGS_SHOW_COMPOUNDNODES',
  'NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES',
  'NEXT_PUBLIC_SETTINGS_SUBPACKAGE_DEPTH',
] as const;

describe('[readSettingsEnvironment]', () => {
  it('uses the documented defaults when settings are absent', () => {
    withSettingsEnvironment({}, () => {
      expect(readSettingsEnvironment()).toEqual({
        cytoscapeLayout: 'concentric',
        cytoscapeLayoutSpacing: 1,
        showCompoundNodes: true,
        showVendorPackages: false,
        subPackageDepth: 1,
      });
    });
  });

  it('reads all supported explicit settings', () => {
    withSettingsEnvironment(
      {
        NEXT_PUBLIC_SETTINGS_LAYOUT: 'breadthfirst',
        NEXT_PUBLIC_SETTINGS_LAYOUT_SPACING: '0.5',
        NEXT_PUBLIC_SETTINGS_SHOW_COMPOUNDNODES: 'false',
        NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES: 'true',
        NEXT_PUBLIC_SETTINGS_SUBPACKAGE_DEPTH: '3',
      },
      () => {
        expect(readSettingsEnvironment()).toEqual({
          cytoscapeLayout: 'breadthfirst',
          cytoscapeLayoutSpacing: 0.5,
          showCompoundNodes: false,
          showVendorPackages: true,
          subPackageDepth: 3,
        });
      }
    );
  });

  it('falls back for unsupported layouts, invalid booleans, and out-of-range spacing', () => {
    withSettingsEnvironment(
      {
        NEXT_PUBLIC_SETTINGS_LAYOUT: 'unsupported',
        NEXT_PUBLIC_SETTINGS_LAYOUT_SPACING: '1.1',
        NEXT_PUBLIC_SETTINGS_SHOW_COMPOUNDNODES: 'yes',
        NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES: 'yes',
      },
      () => {
        expect(readSettingsEnvironment()).toEqual({
          cytoscapeLayout: 'concentric',
          cytoscapeLayoutSpacing: 1,
          showCompoundNodes: true,
          showVendorPackages: false,
          subPackageDepth: 1,
        });
      }
    );
  });

  it('requires subpackage depth to be a positive integer', () => {
    for (const invalidDepth of ['0', '-1', '2.5', 'not-a-number']) {
      withSettingsEnvironment(
        { NEXT_PUBLIC_SETTINGS_SUBPACKAGE_DEPTH: invalidDepth },
        () => expect(readSettingsEnvironment().subPackageDepth).toBe(1)
      );
    }
  });
});

function withSettingsEnvironment(
  values: Partial<Record<(typeof SETTINGS_ENV_NAMES)[number], string>>,
  action: () => void
) {
  const previous = Object.fromEntries(
    SETTINGS_ENV_NAMES.map(name => [name, process.env[name]])
  ) as Record<(typeof SETTINGS_ENV_NAMES)[number], string | undefined>;

  try {
    for (const name of SETTINGS_ENV_NAMES) delete process.env[name];
    for (const [name, value] of Object.entries(values)) process.env[name] = value;
    action();
  } finally {
    for (const name of SETTINGS_ENV_NAMES) {
      const value = previous[name];
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }
}
