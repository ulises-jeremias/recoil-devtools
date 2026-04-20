# Recoil DevTools Demo

A modern Vite app demonstrating all Recoil DevTools packages.

## Setup

```bash
# From monorepo root:
cd recoil-devtools-demo

# Install with workspace links:
pnpm install

# Start dev server:
pnpm dev
```

## Features

- All 4 packages: `recoil-devtools`, `recoil-devtools-logger`, `recoil-devtools-log-monitor`, `recoil-devtools-dock`
- Recoil 0.7 + React 18
- Debug panel with time-travel
- Persistence via localStorage

## Architecture

- Vite 6 + React 18
- TypeScript (relaxed for demo)
- No workspace link (standalone app)

For CI, this demo is excluded. Build manually to test.