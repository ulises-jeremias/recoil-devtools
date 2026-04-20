# Development

This project uses Turborepo for orchestration and tsup for building.

## Commands

```sh
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run typecheck
pnpm typecheck

# Run tests
pnpm test

# Lint
pnpm lint

# Development mode
pnpm dev
```

## Project Structure

```
packages/
  recoil-devtools/           # Main composited package
  recoil-devtools-dock/    # Dock container
  recoil-devtools-log-monitor/ # Log monitor UI
  recoil-devtools-logger/  # Console logger
  recoil-devtools-themes/   # Color themes
```

## Adding a New Package

1. Create directory in `packages/`
2. Add `package.json` with proper scripts
3. Run `pnpm install` to link workspace
4. Update `turbo.json` if needed

## Testing

```sh
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## Building

```sh
# Build all
pnpm build

# Build single package
pnpm --filter=recoil-devtools build
```

## Publishing

```sh
# Use changesets
pnpm changeset
pnpm changeset version
pnpm changeset publish
```
