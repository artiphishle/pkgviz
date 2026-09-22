# @ankhorage/contracts

## 22.2.0

### Minor Changes

- af50e7e: Publish generated structural evidence for canonical ScreenSpec metadata authoring.

## 22.1.2

### Patch Changes

- bc6d757: Make the structure runtime subpath loadable directly under Node ESM by emitting explicit JavaScript module specifiers.

## 22.1.1

### Patch Changes

- 3518d8d: Export the canonical entity-registry, value-map, and serializable-set markers from the structure subpath for descriptor generators.

## 22.1.0

### Minor Changes

- ce696c3: Publish canonical structural descriptor contracts and explicit entity-registry/value-map collection semantics for deterministic authoring metadata generation.

## 22.0.4

### Patch Changes

- 6d1e774: Update Ankhorage dependencies: `@ankhorage/utility`.

## 22.0.3

### Patch Changes

- 481bc15: Update Ankhorage dependencies: `@ankhorage/utility`.

## 22.0.2

### Patch Changes

- ab3dff9: Update Ankhorage dependencies: `@ankhorage/color-theory`, `@ankhorage/paradox`.

## 22.0.1

### Patch Changes

- dae0cab: Keep the portable splash-screen manifest contract independent from Expo package installation.

## 22.0.0

### Major Changes

- 258f45f: Normalize AppManifest collection semantics: keyed registries for stable entities, serializable sets for unordered membership, one module registry, keyed workload collections, and one canonical serializable value shape.

## 21.0.0

### Major Changes

- 94a9eb0: Add a provider-neutral control-plane credential port with optional lookup and explicit persistence, and add an optional service preparation phase for mutating infrastructure lifecycle orchestration.

## 20.0.0

### Major Changes

- 1034b76: Replace the unrealizable continuous database backup intent with provider-neutral scheduled S3
  backups.

## 19.5.0

### Minor Changes

- d078138: Add provider-neutral S3 persistence targets for continuous database backups and external Supabase
  Storage backends.

## 19.4.0

### Minor Changes

- 59277a2: Add portable image-seeded initialization for persistent workload volumes.

## 19.3.0

### Minor Changes

- 03da0f5: Add runtime-neutral ACME HTTP-01 TLS intent to Infra networking, including validation that automatic TLS uses a matching HTTPS public origin and domain.

## 19.2.2

### Patch Changes

- cd59eb6: Make deploy-provider declarations resolvable by NodeNext consumers and validate the built package self-export.

## 19.2.1

### Patch Changes

- e331a1b: Provide the project root to deployment-provider setup adapters so project-aware providers can
  inspect setup without depending on Deploy implementation state.

## 19.2.0

### Minor Changes

- 8644f9c: Add portable deployment provider contracts for provider registration, native builds, store delivery, listings, monetization, and releases.

## 19.1.0

### Minor Changes

- 95ed577: add fixed published ports for public workloads

## 19.0.0

### Major Changes

- cb4bee3: Require compute adapters to implement `inspectAsync` and return an `InfraComputeSnapshot` without
  creating, updating, or deleting resources. `ensureAsync` now returns the same canonical snapshot
  shape.

  This separates read-only target discovery from reconciliation so `infra plan`, `infra generate`,
  and validation can resolve existing portable targets without invoking a mutating lifecycle method.
  Compute-adapter consumers must add `inspectAsync(context, selection)` before upgrading.

## 18.0.0

### Major Changes

- 922bb42: Add runtime-neutral workload value templates for values composed from literals, secrets, bootstrap credentials and resource outputs. Add a canonical public HTTP(S) base URL to environment networking so services can configure external URLs before startup without runtime-specific interpolation. Persist portable compute targets and safe outputs in the canonical Infra ledger so later CLI processes can resume runtime lifecycle and render outputs without resolved credential values.

## 17.0.0

### Major Changes

- ba68b95: Allow runtime-neutral workloads to reference keyed control-plane bootstrap credentials, let Cerbos selections carry explicit portable policy files, and require desired runtime targets for status, suspend and destroy so adapters remain stateless across CLI invocations.

## 16.1.0

### Minor Changes

- 89990ec: Add separate Hetzner SSH bootstrap configuration without conflating it with cloud API credentials.

## 16.0.0

### Major Changes

- 5f7c17d: Require runtime desired state to carry the already resolved outputs available to portable workload output references.

## 15.0.0

### Major Changes

- 8693243: Replace the single-target Infra manifest with canonical local/preview/production environments and
  closed compute/runtime/service selections. The public `@ankhorage/contracts/infra` entrypoint owns
  provider config maps, exact compatibility typing and validation, adapter/package descriptors,
  portable compute targets and workloads, lifecycle results, outputs, diagnostics and ownership/
  retention contracts.

  Move `storage` to environment-local `objectStorage`, move nested authorization to sibling `authz`,
  and remove deployment monitoring, implicit storage providers and unused CDN flags. Move app state
  to optional `AppManifest.state`; Legend can only declare `persistence: false` or omit persistence.
  Superseded Infra types and the secret-store module augmentation are removed, with no compatibility
  aliases or dual manifest shapes. Auth flow, profile and OAuth references remain supported.

  Shared environment IDs now live at `@ankhorage/contracts/environments` as `APP_ENVIRONMENT_IDS` and
  `AppEnvironmentId`, replacing Deploy-specific environment names. App shipment target IDs remain
  unchanged. Existing application runtime SecretStore/DB/Auth/Storage/State adapter ports remain
  separate from infrastructure providers.

  Release Contracts before migrating direct consumers. Templates and Studio must then adopt the
  published API and correct their Legend persistence manifests; this release alone does not complete
  Phase 1 of ankhorage/infra#145 or implement provider lifecycle behavior.

  Use the published Utility object, array and string helpers directly for structural validation.
  Remove local duplicates and the internal AppManifest shared helper module without changing the
  public parser behavior.
  Require Utility `^0.8.0`, which has no reverse Contracts dependency and exports `isOptionalString`.
  Reuse this guard for optional string fields instead of duplicating its predicate inline.

## 14.0.0

### Major Changes

- abe51bb: Derive portable AppManifest splash-screen options from the official Expo splash-screen plugin contract while replacing file paths with media references.

## 13.0.1

### Patch Changes

- 92c401e: Use package metadata as the default Paradox documentation title and description.

## 13.0.0

### Major Changes

- ef01878: Replace raw splash-screen image paths with stable media asset references so generated hosts can resolve the current bundled asset location.

## 12.0.1

### Patch Changes

- 4a6a112: Export the standalone AppNavigatorManifest structural type guard from the navigator contract.

## 12.0.0

### Major Changes

- 89dfb46: Align the portable Navigator contract with the standalone catalog lifecycle: remove flow-specific
  manifest and runtime fields, name the headless Tabs implementation explicitly, normalize structural
  preset IDs, and add catalog, capability, dependency, planning, generation, and verification result
  types.

## 11.1.0

### Minor Changes

- 8a62b08: Expose the portable Navigator planning, generation, and custom-registration contracts through the navigator subpath. Group related declarations by topic so Navigator and Studio can consume canonical shared types without depending on another capability's type exports.

## 11.0.0

### Major Changes

- 1696309: Add serializable Slot, typed Stack, Drawer, Tabs, Split View, and Custom navigator variants with matching structural validation.

  This is a breaking contract change: the arbitrary navigator `options` bag is removed, Stack and Drawer options are now finite typed branches, custom tabs use strict presentation discriminants, and invalid or non-JSON custom configuration is rejected. No authored `options` values were found in the current canonical consumers; the major release prevents their existing `^10` ranges from receiving the narrowed contract automatically.

## 10.1.0

### Minor Changes

- 958b0a2: Allow manifest icon specifications to reference SVG media assets through a mutually exclusive
  `source` branch.

## 10.0.0

### Major Changes

- 8835ea2: Replace the legacy `NavigatorSpec` contract with the focused `AppNavigatorManifest` slice, publish it through `@ankhorage/contracts/navigator`, and add typed topology presets plus adaptive, JavaScript, native, and custom tab implementation/presentation desired state.

## 9.0.0

### Major Changes

- f41542b: Rename the serialized `RepositoryConfig` contract to `RepositoryManifest` while keeping `manifest.repository` as the canonical singular repository desired-state property.

## 8.2.0

### Minor Changes

- a2e43e3: Export the reusable `RepositoryConfig` contract slice and compose `AppManifest` from it.

## 8.1.0

### Minor Changes

- 061bba3: Add the canonical optional GitHub repository configuration to `AppManifest`.

## 8.0.2

### Patch Changes

- 19d45dc: Update Ankhorage dependencies: `@ankhorage/color-theory`.

## 8.0.1

### Patch Changes

- f932e26: Add the canonical `ebookReader` platform requirement capability for manifest-authored EPUB and PDF reader surfaces.

## 8.0.0

### Major Changes

- 1eae0ae: Make `infra.apis[]` the canonical API manifest source, bind API operations by `apiId`, and remove the generated-API, API-flavoured data-source, and global `settings.apiBaseUrl` contract paths while keeping explicit database sources separate.

## 7.9.0

### Minor Changes

- 1fa1570: Allow CLI provider manifests to declare category-root commands with an empty command path.

## 7.8.0

### Minor Changes

- e0358fc: Add neutral setup requirement metadata for target-, environment-, and transport-aware administration planning.

## 7.7.0

### Minor Changes

- 00d608f: Add canonical application environment IDs and stable native scheme identity to app deployment target contracts.

## 7.6.0

### Minor Changes

- 49c4b9f: Add provider-neutral `media` component-property authoring metadata with optional canonical `MediaAssetKind` constraints, so authoring tools can identify accepted media kinds without provider-specific or Image-specific fields.

## 7.5.0

### Minor Changes

- 4383dc0: Add canonical provider-neutral app deployment contracts for Web, Android, and iOS, expose them through `AppManifest.deploy` and `@ankhorage/contracts/deploy`, and validate the serialized deployment subtree through the canonical AppManifest parser.

## 7.4.0

### Minor Changes

- 06223da: Add provider-neutral object listing and readable URL resolution capabilities for app-authoring media storage adapters.

## 7.3.0

### Minor Changes

- 09d62a0: Add the canonical app-authoring media catalog, stable media references, provider-neutral storage/URL/bundled media sources, and manifest validation that rejects transient local media URLs.

## 7.2.0

### Minor Changes

- b24a014: Add canonical runtime parsing and validation for `AppManifest` so consumers can share the Contracts-owned manifest shape instead of maintaining structural guards independently.

## 7.1.0

### Minor Changes

- 97fbc01: Add canonical serializable theme-global token overrides and generic component/pattern recipe override values without duplicating runtime token state or package-owned recipe metadata.

## 7.0.0

### Major Changes

- 24d3c97: Remove the unused nutrition contracts and the public `@ankhorage/contracts/nutrition` subpath export.

## 6.0.0

### Major Changes

- 6dd3d50: Replace the Ankhorage module registry fields on `InfraManifest` with the canonical `modules` and `modulesConfig` names. The obsolete `plugins` and `pluginsConfig` fields are removed without compatibility aliases.

## 5.0.0

### Major Changes

- 671bbcb: Replace the tab-specific route visibility field with `showInPrimaryNavigation`. Omitted routes remain visible by default, while `false` hides a route from Tabs and Drawer primary navigation without removing its navigability.
- b125e14: Replace the mixed REST, OpenAPI, GraphQL, and managed-API data-source kinds with an orthogonal API/database model. APIs now declare external/generated origin and REST/GraphQL protocol, while OpenAPI is optional REST description metadata. Preserve generated REST/CRUD desired state in a dedicated manifest registry and keep its normalized runtime data-source projection separate, with no speculative API-server generator adapter.

### Patch Changes

- a804711: Release trigger

## 4.0.1

### Patch Changes

- ee60d69: Update COLOR-THEORY

## 4.0.0

### Major Changes

- 083419b: Add canonical AppManifest metadata category ownership using the shared AppCategory contract.

## 3.0.0

### Major Changes

- d46f70b: Replace the optional URL-only OAuth adapter methods with one canonical provider-neutral OAuth capability that requires authorization start and callback completion, models transport cancellation and failures explicitly, and resolves successful OAuth sign-in to the existing `AuthSession` contract.

## 2.1.0

### Minor Changes

- 7249c06: Add provider-neutral secret-store contracts, canonical `infra.secretStore` provider selection, logical OAuth `credentialsRef` support, and validation helpers that reject inline secret fields.

## 2.0.0

### Major Changes

- 7c7e59f: Make `infra.auth.flow` the only authentication-flow contract, remove auth flow from application settings, make authorization optional, and export the canonical auth-flow resolver.

## 1.19.4

### Patch Changes

- 2001d64: Move the CLI contracts source to the canonical `src/cli/index.ts` layout and align the published subpath output.

## 1.19.3

### Patch Changes

- 01a73ed: Update CLI provider metadata examples.

## 1.19.2

### Patch Changes

- 20bd7b6: Add shared runtime callback contracts for node prop resolvers and callback maps.

## 1.19.1

### Patch Changes

- 37105b0: Add published ankh package metadata and document capability naming conventions.

## 1.19.0

### Minor Changes

- b618979: Add `@ankhorage/contracts/cli` metadata contracts for Ankh package discovery.

## 1.18.3

### Patch Changes

- eae9dfc: Add typed screen data-loader definitions for generic operation loaders and support repeat empty-state nodes on UI repeats.

## 1.18.2

### Patch Changes

- ece9644: Add a generic `UiNode.repeat` manifest primitive for repeated child rendering from binding sources.

## 1.18.1

### Patch Changes

- fde5aeb: Add scanner workflow binding coverage to confirm existing generic contracts support runtime-aligned barcode lookup and conditional navigation flows without new domain-specific types.

## 1.18.0

### Minor Changes

- 7db80ba: Add manifest contracts for inferred screen permissions and capabilities.

## 1.17.0

### Minor Changes

- aab2073: Add profile table metadata to auth profile specs.

## 1.16.0

### Minor Changes

- 5105c41: Add API authoring contracts for generated and external APIs with explicit endpoints, generated CRUD presets, and collection-backed resources.

## 1.15.0

### Minor Changes

- 94d5656: Add frontend-first app dataset contracts and state provider selection to app manifests.

## 1.14.0

### Minor Changes

- d55e849: Add a provider-neutral splash screen branding contract to app manifests.

## 1.13.0

### Minor Changes

- 15e9234: Add provider-neutral OAuth2 auth contracts and manifest auth config support.

## 1.12.0

### Minor Changes

- 440f28e: Replace node-local prop bindings with app-level component data-binding contracts that reference data-source operations.

## 1.11.0

### Minor Changes

- 17b8d75: Add bindable component metadata contracts for declaring data-bindable component props and events.

## 1.10.0

### Minor Changes

- d637fdc: Add provider-neutral UI component metadata contracts for component registries and extension package manifests.

## 1.9.0

### Minor Changes

- d1e08cc: Add provider-neutral data-source, endpoint, operation, schema, credential, adapter, and diagnostic contracts.

## 1.8.0

### Minor Changes

- e70556e: Add provider-neutral data and state binding contracts for manifest node props and database collection queries.

## 1.7.0

### Minor Changes

- eff4efc: Add provider-neutral state adapter contracts for path-based reads, writes, subscriptions, and optional removal support.

## 1.6.0

### Minor Changes

- bde43ab: Add provider-neutral action value sources, typed action bindings, and normalized command DTO contracts for event-driven runtime action resolution.

## 1.5.0

### Minor Changes

- 524a288: Add normalized component event DTO contracts for stable component-emitted event envelopes, including form submit, button press, and collection item press events.

## 1.4.0

### Minor Changes

- 3172bd4: Add manifest node event bindings so `UiNode` can declare provider-neutral event-to-action mappings such as `submit` actions for email and database persistence.

## 1.3.1

### Patch Changes

- f7580f4: Update packages

## 1.3.0

### Minor Changes

- 9dadeaf: Replace the database contract surface with canonical provider-neutral CRUD capabilities and add realtime subscription plus privileged admin/schema contracts.

## 1.2.0

### Minor Changes

- f773215: Add provider-neutral storage and image asset contracts.

  This introduces serializable storage asset references, a `StorageAdapter` contract for upload, remove, and public URL workflows, and manifest-safe `ImageAssetSource` variants for storage-backed and URL-backed images.

  The storage upload boundary uses `Uint8Array` only, avoids DOM-specific `File`/`Blob` types, and keeps storage identity provider-neutral through `storageId`, `bucket`, and `path`.

## 1.1.1

### Patch Changes

- 1a4c2b5: update package

## 1.1.0

### Minor Changes

- e7fad36: `ThemeModeConfig.harmony` now uses `ColorHarmony` from `@ankhorage/color-theory` instead of `string`.
  - `ThemeModeConfig.harmony` is now typed as `ColorHarmony` (one of `"monochromatic"`, `"analogous"`, `"complementary"`, `"triadic"`, `"tetradic"`, `"splitComplementary"`).
  - `ColorHarmony` is re-exported as a type-only export from the root entrypoint.
  - Color generation helpers (`generateHarmonyRoleColors`, `generateThemeModeColors`, etc.) are not exported from Contracts; consumers must import them from `@ankhorage/color-theory` directly.
  - Old tone/mood/recommendation APIs (`ColorTone`, `AppMood`, `APP_MOODS`, etc.) are not present in this package.

## 1.0.0

### Major Changes

- b0632c9: Remove the old tone/mood/theme-recommendation contracts and keep theme config serialized-only:
  - Removed `COLOR_TONES`, `ColorTone`, `APP_MOODS`, `AppMood`, recommendation
    types/constants, and `suggestedColorTone`.
  - Removed `ThemeModeConfig.colorTone`; `ThemeModeConfig` is now
    `{ primaryColor: string; harmony: string }`.
  - Removed the legacy `@ankhorage/contracts/color-theory` export.
  - Removed color generation, swatch, contrast, neutral, and semantic color APIs from
    Contracts; color generation now belongs in `@ankhorage/color-theory`.
  - Removed the Contracts dependency on `culori`.

## 0.3.2

### Patch Changes

- bb775a6: Standardize package metadata and workflow files.

## 0.3.1

### Patch Changes

- d5ca119: Release Trigger

## 0.3.0

### Minor Changes

- 9e27c89: Add app category theme recommendation contracts and a partial category recommendation map for theme tooling.

## 0.2.0

### Minor Changes

- 3536f12: Adds shared color-theory contracts and renames theme mode configuration from `systemTone` / `SystemTone` to `colorTone` / `ColorTone`.

## 0.1.3

### Patch Changes

- 7eb0dbc: Add canonical auth flow config types using sign-in, sign-up, and sign-out terminology.

## 0.1.2

### Patch Changes

- fc2928d: update publish config to 'public' access

## 0.1.1

### Patch Changes

- 7075528: add repository metadata

## 0.1.0

### Minor Changes

- 07b8da7: Add shared auth and database adapter contracts.

### Patch Changes

- 5c800d8: add missing script

## 0.0.4

### Patch Changes

- Refresh the README copy so the published package overview and usage example stay aligned with the current messaging.

## 0.0.3

### Patch Changes

- 908b4de: Export `APP_CATEGORIES` and `AppCategory` so template packages can consume the shared category contract instead of redefining it.

## 0.0.2

### Patch Changes

- 2c2e771: Migrate to @ankhorage/devtools for shared ESLint and Prettier configuration.
