# @ankhorage/utility

## 1.4.0

### Minor Changes

- 5cf2161: Add strict boolean and finite number readers to the public Node environment utility entrypoint.

## 1.3.0

### Minor Changes

- eba3d9b: Add a safe reusable Node.js browser launcher that opens only HTTP(S) URLs without invoking a command shell.

## 1.2.1

### Patch Changes

- 431aebe: Add reusable regular-expression escaping and symlink-aware rooted filesystem helpers.

## 1.2.0

### Minor Changes

- 82bb78d: Add reusable deep equality and immutable deep merge operations to the object utility API.

## 1.1.0

### Minor Changes

- 875d001: Add `ensureTrailingSlash` to the public URL utilities.

## 1.0.0

### Major Changes

- 15acc87: Remove the project detection implementation and the @ankhorage/utility/project public subpath. Import detectProject from @ankhorage/project-detector and its public types from @ankhorage/project-detector/types instead. The standalone detector also provides bounded filesystem inspection through its /node subpath. Utility does not depend on the detector or retain a compatibility re-export.

## 0.8.0

### Minor Changes

- 96d80ff: Expose `isOptionalString` from `@ankhorage/utility/string` so consumers can reuse optional-string
  validation. The guard accepts `undefined` and all primitive strings, including empty and
  whitespace-only strings, and rejects `null` and other types. It has no Contracts dependency.

## 0.7.0

### Minor Changes

- 2c50c45: Remove the public `@ankhorage/utility/image` entrypoint and its Contracts, Sharp, OpenCV,
  Tesseract and Pixelmatch dependencies. The entire image-analysis capability belongs in a
  separate repository. Preserve its implementation and tests as commented source at the
  maintainer's request; exclude that source from the published build.

  This is a breaking API removal in the pre-1.0 package. Screenshot-analysis consumers such
  as the zora-designer skill must move to the future owning package before using this API
  again. The remaining Utility subpaths are unchanged, and Utility no longer depends on
  Contracts.

## 0.6.0

### Minor Changes

- 6405b51: Add a generic async generator that executes lazy input sequences and yields each completed result.

## 0.5.5

### Patch Changes

- 9ba2692: Exclude evidenced decorative glyphs from Tesseract line observations while preserving uncertain text.

## 0.5.4

### Patch Changes

- 526b9a9: Skip redundant region OCR for containers whose descendants already own text evidence.

## 0.5.3

### Patch Changes

- ba0fdea: Keep screenshot-derived component props limited to observed visual evidence, identity scaffolding, and explicit runtime state defaults.

## 0.5.2

### Patch Changes

- 7b5484f: Preserve OCR-only screenshot copy as grouped visual evidence and recover text from meaningful textless regions with targeted preprocessed OCR.

## 0.5.1

### Patch Changes

- 8e8970d: Reduce screenshot-recognition over-segmentation and require semantic evidence before interactive component matches can cross the configured confidence threshold.

## 0.5.0

### Minor Changes

- f213bb4: Add local UI screenshot analysis that derives canonical Contracts `ScreenSpec` manifests with Sharp/OpenCV geometry, metadata-driven component matching, optional OCR evidence, and pixel-diff verification.

## 0.4.0

### Minor Changes

- ae08eb7: Own reusable JavaScript string/source-literal serialization and safe static named-import validation in the string and validation APIs. Extract the existing Navigator behavior without any Navigator or framework dependency.

## 0.3.0

### Minor Changes

- 9ea3d3d: Add focused functional utility subpaths extracted from Studio, including platform-specific Node,
  Expo, web, and React Native helpers.

## 0.2.0

### Minor Changes

- 05c8cb6: Replace ambiguous regex-like helpers with canonical email, phone, username, and HTTP URL validators.

## 0.1.1

### Patch Changes

- 494c294: Release trigger

## 0.1.0

### Minor Changes

- fccaa12: Add the initial shared utility package with project detection and regex subpaths.
