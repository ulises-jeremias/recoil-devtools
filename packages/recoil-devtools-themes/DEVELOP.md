# Development

This package uses `tsup` for building.

## Commands

```sh
# Build
pnpm build

# Watch mode
pnpm dev

# Typecheck
pnpm typecheck

# Tests
pnpm test
```

## Project Structure

```
src/
  index.ts       # Entry point
  *.ts          # Theme definitions
```

## Theme Format

Themes follow the Base16 specification:

```ts
interface Base16Theme {
  scheme: string;
  author: string;
  base00: string; // Background
  base01: string; // Selection
  base02: string; // Comments
  // ... etc
}
```

## Adding a Theme

1. Create a new theme file in `src/`
2. Export it from `index.ts`
3. Update tests if needed

## Building

Uses tsup for bundling:

- ESM output
- CJS output
- TypeScript declarations

## Publishing

```sh
pnpm build
pnpm changeset
pnpm changeset version
pnpm changeset publish
```
