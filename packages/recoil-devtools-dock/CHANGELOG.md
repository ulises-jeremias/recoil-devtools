# recoil-devtools-dock

## 1.1.0

### Minor Changes

- bf0431a: Add npm OIDC trusted publisher with provenance attestation for secure package publishing.

## 1.0.2

### Patch Changes

- f0bd27a: Correct the LogMonitor link in DockMonitor validation output.

## 1.0.1

### Patch Changes

- Improve publish readiness for all packages by modernizing docs, cleaning legacy examples, and strengthening community/project metadata.

  ### Highlights
  - Remove outdated legacy example apps and old demo code.
  - Add/refresh README guidance, props defaults, and unified demo references.
  - Add named exports for monitor packages to match documented usage.
  - Add initial package changelogs and root contribution/community files.
  - Add GitHub Pages workflow for the Vite demo and configure demo base path.

## 1.0.0 - 2026-05-15

### Initial public release

- ESM + CommonJS builds with full TypeScript types via `tsup`
- React 18 and Recoil 0.7+ peer dependencies
- Compatible with Node 18+

- Resizable, movable dock panel built on `react-dock`
- Keyboard shortcuts: `ctrl+h` toggle, `ctrl+q` change position, `ctrl+m` change monitor
- Persists dock position and visibility to `localStorage`
- Built-in keyboard-shortcut overlay button
