import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'bun:test';

import type { SelectionSemantics, SurfaceColorDiagnostics } from './features/theme/public';
import { createTheme } from './features/theme/public';

const indexSource = readFileSync(new URL('./index.ts', import.meta.url), 'utf8');
const packageJson = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  exports: Record<string, unknown>;
  files: string[];
  peerDependencies: Record<string, string>;
};

const expectedFeatureRootExports = [
  "export { AppBar } from './features/app-bar/public';",
  "export { Badge } from './features/badge/public';",
  "export { Button, IconButton } from './features/button/public';",
  "export { Card } from './features/card/public';",
  "export { Checkbox } from './features/form/checkbox/public';",
  "export { Field } from './features/form/field/public';",
  "export { Radio } from './features/form/radio/public';",
  "export { Switch } from './features/form/switch/public';",
  "export { TextInput } from './features/form/text-input/public';",
  "export { Icon, SUPPORTED_ICON_PROVIDERS } from './features/icon/public';",
  "export { Image } from './features/image/public';",
  "export { KeyboardAvoidingView } from './features/keyboard-avoiding-view/public';",
  "export { Divider, Grid, ScrollView, View } from './features/layout/public';",
  "export { List, ListItem } from './features/list/public';",
  "export { Modal } from './features/modal/public';",
  "export { PopoverMenu } from './features/popover-menu/public';",
  "export { Popover } from './features/popover/public';",
  "export { Pressable } from './features/pressable/public';",
  "export { Surface } from './features/surface/public';",
  "export { Tab, TabList, TabPanel, Tabs } from './features/tabs/public';",
  "export { Tooltip } from './features/tooltip/public';",
  "export { Toast, ToastProvider, useToast } from './features/toast/public';",
  "export { Heading, Text } from './features/typography/public';",
] as const;

const expectedCrossCuttingRootExports = [
  "export type { InteractionPolicy, InteractionPolicyProps } from './types/interactionPolicy';",
  "export * from './core/responsive';",
  "export { FontProvider } from './features/font/public';",
  "export { ThemeProvider, ThemeScope, useTheme } from './features/theme/runtime';",
] as const;

describe('feature-owned root barrel contract', () => {
  it('routes UI through feature-owned public facades', () => {
    expectedFeatureRootExports.forEach((line) => expect(indexSource).toContain(line));
  });

  it('does not retain removed component or layout facades and aliases', () => {
    expect(indexSource).not.toContain("'./components/");
    expect(indexSource).not.toContain("'./layout");
    expect(indexSource).not.toContain("'./primitives/");
    expect(indexSource).not.toMatch(/\bBoxProps\b/u);
    expect(indexSource).not.toMatch(/\bContainerProps\b/u);
    expect(indexSource).not.toMatch(/\bStackProps\b/u);
    expect(indexSource).not.toMatch(/\bScrollAreaProps\b/u);
    expect(indexSource).not.toMatch(/\bTextareaProps\b/u);
    expect(indexSource).not.toMatch(/\bHelperTextProps\b/u);
    expect(indexSource).not.toMatch(/\bLabelProps\b/u);
    expect(indexSource).not.toMatch(/export\s*\{[^}]*\bBox\b/u);
    expect(indexSource).not.toMatch(/export\s*\{[^}]*\bContainer\b/u);
    expect(indexSource).not.toMatch(/export\s*\{[^}]*\bStack\b/u);
    expect(indexSource).not.toMatch(/export\s*\{[^}]*\bScrollArea\b/u);
    expect(indexSource).not.toMatch(/export\s*\{[^}]*\bTextarea\b/u);
    expect(indexSource).not.toMatch(/export\s*\{[^}]*\bHelperText\b/u);
    expect(indexSource).not.toMatch(/export\s*\{[^}]*\bLabel\b/u);
  });
});

describe('remaining root barrel contract', () => {
  it('keeps deliberate cross-cutting public APIs', () => {
    expectedCrossCuttingRootExports.forEach((line) => expect(indexSource).toContain(line));
  });

  it('does not retain obsolete action-sheet, drawer, menu aliases, or navigation chrome', () => {
    expect(indexSource).not.toContain('ActionSheet');
    expect(indexSource).not.toContain("'./components/action-sheet'");
    expect(indexSource).not.toContain("'./components/drawer'");
    expect(indexSource).not.toContain("'./components/navigation'");
    expect(indexSource).not.toContain('DrawerNavigation');
    expect(indexSource).not.toMatch(/\bMenuProps\b/u);
    expect(indexSource).not.toMatch(/\bMenuAction\b/u);
    expect(indexSource).not.toMatch(/export\s*\{\s*Menu\s*\}/u);
    expect(indexSource).not.toContain('NavigationItem');
    expect(indexSource).not.toContain('NavigationList');
    expect(indexSource).not.toContain('TabBar');
  });

  it('keeps internal infrastructure off the public barrel', () => {
    expect(indexSource).not.toContain("'./internal/");
    expect(indexSource).not.toContain('resolveSelectionControlNextChecked');
    expect(indexSource).not.toContain('resolveFieldPresentation');
    expect(indexSource).not.toContain('FocusScope');
    expect(indexSource).not.toContain('useFocusManager');
  });

  it('exports the resolved semantic and diagnostic contracts', () => {
    const theme = createTheme();
    const selection: SelectionSemantics = theme.semantics.selection;
    const diagnostics: SurfaceColorDiagnostics = theme.colorDiagnostics;
    expect(selection.background).toBeDefined();
    expect(diagnostics.generated.swatches).toBe(theme.swatches);
  });
});

describe('public package metadata contract', () => {
  it('keeps package metadata aligned with deliberate public entrypoints', () => {
    expect(packageJson.files).toEqual(['dist', 'src', 'README.md', 'CHANGELOG.md', 'LICENSE']);
    expect(packageJson.exports).toEqual({
      '.': {
        'react-native': './src/index.ts',
        browser: './src/index.ts',
        default: './dist/index.js',
        import: './dist/index.js',
        types: './dist/index.d.ts',
      },
      './bottom-sheet': {
        'react-native': './src/features/bottom-sheet/public.ts',
        browser: './src/features/bottom-sheet/public.ts',
        default: './dist/features/bottom-sheet/public.js',
        import: './dist/features/bottom-sheet/public.js',
        types: './dist/features/bottom-sheet/public.d.ts',
      },
      './color': {
        bun: './src/constants/surfaceColor.ts',
        'react-native': './src/constants/surfaceColor.ts',
        browser: './src/constants/surfaceColor.ts',
        default: './dist/constants/surfaceColor.js',
        import: './dist/constants/surfaceColor.js',
        types: './dist/constants/surfaceColor.d.ts',
      },
      './theme': {
        bun: './src/features/theme/public.ts',
        'react-native': './src/features/theme/public.ts',
        browser: './src/features/theme/public.ts',
        default: './dist/features/theme/public.js',
        import: './dist/features/theme/public.js',
        types: './dist/features/theme/public.d.ts',
      },
      './package.json': './package.json',
    });
  });

  it('supports RN 0.86 patches while validating the canonical RN 0.86.3 baseline', () => {
    expect(packageJson.peerDependencies['react-native']).toBe('0.86.x');
    expect(packageJson.devDependencies['react-native']).toBe('0.86.3');
    expect(packageJson.peerDependencies['react-native-svg']).toBe('15.15.4');
    expect(packageJson.devDependencies['react-native-svg']).toBe('15.15.4');
  });
});

describe('bottom-sheet package contract', () => {
  it('keeps the implementation and Expo 57 runtime boundary explicit', () => {
    expect(packageJson.dependencies['@gorhom/bottom-sheet']).toMatch(/^\^5\./);
    expect(packageJson.peerDependencies['react-native-gesture-handler']).toMatch(/^~2\.32\./);
    expect(packageJson.peerDependencies['react-native-reanimated']).toBe('4.5.1');
    expect(packageJson.peerDependencies['react-native-worklets']).toBe('0.10.1');
  });
});
