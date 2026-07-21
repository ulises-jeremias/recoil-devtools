# recoil-devtools-logger

## 1.2.0

### Minor Changes

- e2ebef3: Upgrade all dependencies to latest major versions:

  - React 19.2.8, react-dom 19.2.8, @types/react 19, @types/react-dom 19
  - TypeScript 6.0.3
  - Vitest 4.1.10, @vitest/coverage-v8 4.1.10
  - Vite 8.1.4, @vitejs/plugin-react 6.0.3
  - eslint-plugin-react-hooks 7.1.1
  - @testing-library/jest-dom 7.0.0
  - react-dock 0.8.0
  - react-json-tree 0.20.0
  - jsdom 29.1.1
  - lint-staged 17.0.0

## 1.1.0

### Minor Changes

- bf0431a: Add npm OIDC trusted publisher with provenance attestation for secure package publishing.

## 1.0.2

### Patch Changes

- d568b10: Wait for selected Recoil values before emitting transaction logs.

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

- Logs Recoil atom changes (prev / action / next) to the browser console
- Configurable colors, level, timestamp, duration, collapse, and predicate
- `createLogger` factory for custom logger configurations
