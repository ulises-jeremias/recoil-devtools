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
  index.ts      # Entry point
  components/  # React components
  hooks/        # Custom hooks
  utils/        # Utilities
test/
  *.test.tsx    # Tests
```

## Building

Uses tsup for bundling:

- ESM output
- CJS output
- TypeScript declarations

## Testing

Uses Vitest for testing.

## Publishing

```sh
pnpm build
pnpm changeset
pnpm changeset version
pnpm changeset publish
```
