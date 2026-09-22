# @ankhorage/surface

## 9.0.12

### Patch Changes

- 3dad165: Forward canonical View layout props through Tabs and TabPanel so bounded tab content can host a scrolling child.

## 9.0.11

### Patch Changes

- 7a6cd3f: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 9.0.10

### Patch Changes

- 93ce233: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 9.0.9

### Patch Changes

- 91caf32: Make the public bottom-sheet boundary portable on Web with React Native Web scrollables and a
  Gorhom-free browser provider while preserving the native Gorhom implementation.

## 9.0.8

### Patch Changes

- f7e83d0: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 9.0.7

### Patch Changes

- 82ee0ad: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 9.0.6

### Patch Changes

- a4d56dd: Render Surface icons through a native-free web adapter using the official React Native Vector Icons
  glyphmaps and fonts, preventing browser bundles from reaching React Native codegen modules.

## 9.0.5

### Patch Changes

- 233f5ea: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 9.0.4

### Patch Changes

- 0ac31c6: Update Ankhorage dependencies: `@ankhorage/contracts`, `@ankhorage/utility`.

## 9.0.3

### Patch Changes

- 177b0ac: Update Ankhorage dependencies: `@ankhorage/color-theory`, `@ankhorage/contracts`, `@ankhorage/paradox`.

## 9.0.2

### Patch Changes

- c046554: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 9.0.1

### Patch Changes

- 43bfcf9: Expose the canonical Surface color and emphasis catalogs through the React-free `@ankhorage/surface/color` subpath.

## 9.0.0

### Major Changes

- c514433: Normalize theme, font, interaction-policy, and surface-color ownership. Add a nested ThemeScope boundary, remove raw theme/context internals and translation runtime from the public API, and consume deep object operations from @ankhorage/utility.

## 8.0.0

### Major Changes

- 337bcec: Replace the public `ButtonBase` foundation primitive with the native-aligned `Pressable` feature. Import `Pressable` and `PressableProps` from `@ankhorage/surface`; the legacy `src/primitives` path and `ButtonBase` API are removed.

## 7.0.0

### Major Changes

- 2977e37: Move the remaining legacy component APIs into canonical feature ownership. `Field` and `Switch` now live under the form capability, `List` and `ListItem` share the new list capability, and `Textarea`, `Label`, and `HelperText` are removed in favor of `TextInput multiline` and field-owned presentation.

## 6.0.0

### Major Changes

- 574a34b: Replace legacy layout aliases with canonical React Native-named `View` and `ScrollView` primitives, remove redundant layout presets, and move AppBar and responsive Show to their owning boundaries.

## 5.0.1

### Patch Changes

- 14c083f: Move Modal and the accessible Tabs system to canonical feature ownership without changing their public root API.

## 5.0.0

### Major Changes

- 33ee8c2: Replace the ambiguous `Menu` API with feature-owned `PopoverMenu`, migrate Tooltip onto the shared Popover capability, and expose Gorhom-integrated bottom-sheet scrollables with direct scrollable content hosting.

## 4.4.1

### Patch Changes

- 6af42ff: Move documentation examples to the repository-root examples structure and add type-aware lint coverage for them.

## 4.4.0

### Minor Changes

- ee44bc6: Add a feature-owned toast runtime and anchored popover foundation, and modernize Surface-owned React contexts to the React 19 context API.

## 4.3.0

### Minor Changes

- 00ffbe0: Add a feature-owned accordion foundation with single/multiple state, controlled and uncontrolled values, accessible trigger/content semantics, and passive interaction support.

## 4.2.1

### Patch Changes

- 69d014d: Migrate ZORA-aligned Surface UI elements to canonical feature-owned source architecture while preserving the public root API.

## 4.2.0

### Minor Changes

- aab8831: Add a stable KeyboardAvoidingView layout primitive backed directly by React Native.

## 4.1.0

### Minor Changes

- 6476bf4: Add the provider-backed BottomSheetModal controller with `BottomSheetProvider` and
  `useBottomSheet()` through the dedicated `@ankhorage/surface/bottom-sheet` entrypoint.

## 4.0.0

### Major Changes

- ae190ea: Remove obsolete ActionSheet, Drawer, and navigation-chrome APIs now owned by canonical composition and @ankhorage/navigator.

## 3.4.6

### Patch Changes

- 191daf8: Render structured Radio children directly instead of nesting non-text React nodes inside native Text while preserving primitive label typography and radio semantics.

## 3.4.5

### Patch Changes

- f297152: Update Ankhorage dependencies: `@ankhorage/contracts`.
- 7bcf2d9: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 3.4.4

### Patch Changes

- f25351a: Render bundled SVG icon assets on React Native Web without relying on the native-only Image asset resolver.

## 3.4.3

### Patch Changes

- 5193f1e: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 3.4.2

### Patch Changes

- 1b6024a: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 3.4.1

### Patch Changes

- 313476c: Type SVG Icon styles as view styles while keeping font Icon styles as text styles.

## 3.4.0

### Minor Changes

- 2ceb0de: Render SVG assets through the existing `Icon` component by accepting a mutually exclusive
  `source` prop backed by `react-native-svg`.

## 3.3.0

### Minor Changes

- 79e8f63: Add a pure `@ankhorage/surface/theme` package entrypoint so non-React tooling can resolve themes and inspect canonical color diagnostics without loading the component runtime.

## 3.2.0

### Minor Changes

- 6d870b5: Complete the resolved runtime color semantics with canonical status colors, accessible interaction states, and Color Theory selection and contrast diagnostics.

## 3.1.3

### Patch Changes

- c72d8c3: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 3.1.2

### Patch Changes

- 5e322be: Update Ankhorage dependencies: `@ankhorage/color-theory`.

## 3.1.1

### Patch Changes

- 125e183: Update Ankhorage dependencies: `@ankhorage/contracts`.

## 3.1.0

### Minor Changes

- 8e53b45: Add the canonical `MaterialDesignIcons` provider backed by the scoped React Native Vector Icons static package.

## 3.0.2

### Patch Changes

- 6151096: Compile React Native Web box pointer-event modes through static styles so empty overlay roots no longer intercept application controls.

## 3.0.1

### Patch Changes

- c07471b: Support the React Native 0.86 patch line as a peer while validating Surface against the canonical React Native 0.86.3 application baseline.

## 3.0.0

### Major Changes

- cf8741c: Move the consumer baseline to React 19.2.3, React Native 0.86.2, React Native Web 0.21, and TypeScript 6. Replace the Expo vector-icons resolver with the portable scoped RNVI static architecture for the intentional Ionicons and Font Awesome provider contract. FontAwesome5 and FontAwesome6 icons now require an explicit typed `regular`, `solid`, or `brand` variant.

## 2.2.1

### Patch Changes

- 7f410d4: Preserve Stack child flex and min-size semantics by applying spacing with the container gap property instead of wrapper views.

## 2.2.0

### Minor Changes

- a75ca48: Resolve canonical authored theme token overrides into Surface runtime tokens while preserving defaults, validating invalid values explicitly, avoiding default-token mutation, and keeping module-derived font families isolated from persisted theme source.

## 2.1.1

### Patch Changes

- dbfb4e6: Update COLOR-THEORY

## 2.1.0

### Minor Changes

- b09d26d: Add the uniform interactionPolicy="enabled" | "passive" contract to Surface-owned interactive primitives.

## 2.0.3

### Patch Changes

- 7a63a04: Add reusable inverse surface/content semantics and use the paired colors for readable mode-aware tooltips.

## 2.0.2

### Patch Changes

- 1f1f02f: Update Menu.

## 2.0.1

### Patch Changes

- 5c55cb1: Add ActionSheet and ActionSheetItem primitives for mobile-friendly contextual actions.

## 2.0.0

### Major Changes

- 67f0775: Replace the public `tone` model with explicit `color` and `emphasis` APIs and export canonical
  Surface color/emphasis constants and types from the root package entrypoint.

  ### Breaking changes
  - Renamed semantic styling props from `tone` to `color` across public components.
  - Renamed content contrast props from `tone` to `emphasis` for text-like APIs.
  - Replaced `ComponentTone`/`TextTone`/`ToastTone` public typings with:
    - `SurfaceColor`
    - `SurfaceEmphasis`
    - `SurfacePaletteColor`
    - `SurfaceStatusColor`
  - Added root exports for:
    - `SURFACE_PALETTE_COLORS`
    - `SURFACE_STATUS_COLORS`
    - `SURFACE_COLORS`
    - `SURFACE_EMPHASES`

  ### Why

  The previous `tone` vocabulary mixed semantic color roles and text emphasis in one concept.
  This change separates those concerns and establishes a single canonical color/emphasis source of
  truth for downstream packages.

## 1.4.0

### Minor Changes

- 247dd05: Add a `ScrollArea` layout primitive for themed, responsive scroll containers.

  `ScrollArea` wraps React Native `ScrollView` behind Surface so higher-level packages such as ZORA can build screen-level scrolling without importing raw React Native scroll primitives directly.

## 1.3.1

### Patch Changes

- 35a27e9: Update packages

## 1.3.0

### Minor Changes

- 4e168c9: Add a low-level `AppBar` layout primitive with leading, center, and trailing slots.

  The new primitive is navigator-agnostic, supports optional safe-area top padding via `react-native-safe-area-context`, and keeps visual styling minimal with an optional divider. It is intended as the Surface foundation for future product-facing AppBar components in ZORA.

## 1.2.0

### Minor Changes

- 73fd969: Add a render-only Image primitive.

  This introduces a Surface `Image` component with string and React Native image source support, token-aware sizing and radius props, `fit`/`resizeMode` behavior, accessibility label mapping, and provider-neutral `fallbackSource` handling for load errors.

## 1.1.0

### Minor Changes

- e7ee603: add router-agnostic chrome primitives

## 1.0.3

### Patch Changes

- c8c99de: Support canonical icon provider aliases for Expo vector icons.

  Surface now resolves provider strings such as `material-community` and `material-community-icons` to Expo's `MaterialCommunityIcons` export, so serialized route icons can use stable provider identifiers without falling back to Ionicons.

## 1.0.2

### Patch Changes

- de83ae5: Consume `@ankhorage/color-theory` semantic status helpers for danger/success/warning roles.

## 1.0.1

### Patch Changes

- c0c242d: update package

## 1.0.0

### Major Changes

- 67248af: **Breaking: Surface now consumes `@ankhorage/color-theory` as the sole runtime color engine**

  ### Removed APIs
  - `AnkhTheme` type removed — replaced by `SurfaceTheme` (no deprecated alias)
  - `ColorTone` re-export removed from Surface
  - `colorTone` field removed from `ThemeConfig`/`ThemeModeConfig` — no longer accepted or read
  - Tone-driven palette generation removed (`getColorToneRolePalette`, `RolePaletteKind`, etc.)
  - Local `ColorScale` model removed — replaced by `ColorSwatch` / `GeneratedThemeSwatches` from `@ankhorage/color-theory`
  - `ThemeTokens.scales` renamed to `ThemeTokens.swatches` (type is now `GeneratedThemeSwatches`)
  - Direct `culori` dependency removed from Surface
  - All local OKLCH helpers, `SCALE_STEPS`, `getHarmonyHues`, `generateColorScale`, `LIGHTNESS_CURVES`, `CHROMA_BY_STEP`, `SEMANTIC_STEPS`, and similar internals removed

  ### New APIs
  - `SurfaceTheme` is now the public resolved runtime theme type
  - `@ankhorage/color-theory` added as a direct runtime dependency
  - `@ankhorage/contracts` updated to `^1.1.0` (no `colorTone` in `ThemeModeConfig`)
  - `resolveSemanticColors()` exported from `colorEngine` — maps color-theory `SemanticColorToken` references to hex values from generated swatches
  - Generated chromatic roles are ordinal only: `primary`, `secondary`, `tertiary`, `quaternary` — no `accent`, `highlight`, `surfaceTint`, or `base` role names in swatches
  - Invalid primary colors now fail deterministically (throw) instead of silently falling back to blue
  - `neutral` swatch is required and powers all foundation semantics (backgrounds, borders, text, disabled states)
  - Primary color is preserved at swatch step `500`: `swatches.primary[500] === modeConfig.primaryColor`
  - Readable foreground tokens derived centrally via `getReadableForeground()` from `@ankhorage/color-theory`

  ### Migration

  Replace `AnkhTheme` with `SurfaceTheme` throughout your codebase.

  Remove `colorTone` from any `ThemeConfig` or `ThemeModeConfig` objects — it is no longer a valid field.

  Replace any reference to `theme.scales` with `theme.swatches`.

## 0.2.4

### Patch Changes

- 598daa1: Add the standard package tooling baseline script and workflow files.

## 0.2.3

### Patch Changes

- 55908af: Align Surface color-tone role palette mappings with the background/foreground lane direction used by app-facing theme tooling.

## 0.2.2

### Patch Changes

- 1711172: Update @ankhorage/contracts

## 0.2.1

### Patch Changes

- 03e62a3: Release Trigger @ankhorage/contracts update

## 0.2.0

### Minor Changes

- d9c21be: Updates theme configuration to use `colorTone` / `ColorTone` from `@ankhorage/contracts` and aligns internal color-engine naming.

## 0.1.12

### Patch Changes

- 173d938: Export @types/culori as a regular dependency

## 0.1.11

### Patch Changes

- c3ed0d8: Update @ankhorage/contracts

## 0.1.10

### Patch Changes

- 01ace8c: update @ankhorage/contracts

## 0.1.9

### Patch Changes

- f454c88: Fix infinite render loop in overlay portal

  Splits overlay context into state and actions to prevent Portal from
  re-registering overlays on every render. Fixes "Maximum update depth exceeded"
  when opening Modal and Drawer.

## 0.1.8

### Patch Changes

- 2869a08: Update test file for package.json 'files' & 'exports'

## 0.1.7

### Patch Changes

- 24eb548: Fix eslint

## 0.1.6

### Patch Changes

- d4d6107: Export src/ for better Metro debugging. Enable inlineSources for builds

## 0.1.5

### Patch Changes

- Refresh the README copy so the published package overview, installation, usage, and positioning match the current messaging.

## 0.1.4

### Patch Changes

- Fix Expo Web icon rendering by importing `@expo/vector-icons` through a bundler-safe static module path instead of runtime `require` resolution.

## 0.1.3

### Patch Changes

- Fix Expo Web icon loading by resolving the runtime module loader from the local Metro `require` function before falling back to `globalThis.require`.

## 0.1.2

### Patch Changes

- Fix Expo Web icon loading by removing the `import.meta`-based runtime require path so Metro can bundle the package correctly.

## 0.1.1

### Patch Changes

- 5aea65c: Stabilize the public package surface for Phase 4 by rewriting the adoption docs, broadening shared tone and variant coverage, tightening read-only control semantics, hardening menu and tab accessibility behavior, and adding regression tests for exports and state contracts.

## 0.1.0

### Minor Changes

- Add Phase-1 design-system primitives and components, including shared semantic theme aliases,
  internal UI resolvers, the `Text` and `ButtonBase` primitives, new layout helpers, and the
  first reusable component wave: `Button`, `IconButton`, `Card`, `Badge`, `ListItem`, and
  `TextInput`.
- Add the Phase-2 form and control layer, including unified field-state and selection-control
  resolvers, form composition primitives (`Field`, `Label`, `HelperText`), `Textarea`, and the
  selection controls `Checkbox`, `Radio`, and `Switch`.
- Add the Phase-3 overlay and navigation layer, including portal and overlay-stack
  infrastructure, centralized focus management, and the new components `Modal`, `Drawer`,
  `Tabs`, `Toast`, `Tooltip`, and `Menu`.
- Refine the Phase-3 overlay and navigation layer by fixing disabled-item keyboard navigation
  in `Menu`, stabilizing tab registration in `Tabs`, recomputing overlay stack ordering after
  removals, and correcting toast timer and dismiss behavior.
- Adopt Changesets-based release tracking for the package, align release access with the
  public npm publish config, add GitHub Actions CI for lint, test, build, and changeset
  validation, and add release automation for npm publishing.

## 0.0.2

### Patch Changes

- b556c63: Replace ESLint and Prettier with @ankhorage/devtools
