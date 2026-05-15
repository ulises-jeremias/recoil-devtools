# Contributing to Recoil DevTools

Thanks for your interest in contributing! This monorepo is community-maintained, and pull requests, bug reports, and ideas are all welcome.

## Local setup

```sh
git clone https://github.com/ulises-jeremias/recoil-devtools.git
cd recoil-devtools
pnpm install
pnpm build
pnpm test
```

Requirements:

- Node.js 18+
- pnpm 9+

## Repository layout

| Path                                   | Description                     |
| -------------------------------------- | ------------------------------- |
| `packages/recoil-devtools`             | Composite DevTools component    |
| `packages/recoil-devtools-dock`        | Resizable dock container        |
| `packages/recoil-devtools-logger`      | Console logger                  |
| `packages/recoil-devtools-log-monitor` | Visual state and action history |
| `packages/recoil-devtools-themes`      | Color themes                    |
| `recoil-devtools-demo/`                | Live Vite + React 18 playground |

## Running the demo

```sh
pnpm --filter recoil-devtools-demo dev
```

## Workflow

1. Open or comment on an issue describing what you want to change.
2. Fork the repo and create a feature branch off `main`.
3. Make your changes with focused commits.
4. Run quality gates locally:
   ```sh
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```
5. Add a changeset describing user-facing changes:
   ```sh
   pnpm changeset
   ```
6. Open a pull request. The PR template will guide you through the rest.

## Coding standards

- TypeScript strict mode for all new code.
- Prettier formatting (`pnpm format`).
- ESLint clean (`pnpm lint`).
- Add or update tests for behavior changes (Vitest + Testing Library).
- Keep public APIs typed and documented.

## Releasing

Releases are driven by [Changesets](https://github.com/changesets/changesets):

1. Each PR with user-visible changes ships a changeset (`pnpm changeset`).
2. Maintainers run `pnpm version-packages` to bump versions and update CHANGELOGs.
3. `pnpm publish-packages` builds and publishes to npm.

## Reporting bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md). A minimal reproducible example (StackBlitz / CodeSandbox / repo) helps a lot.

## Code of Conduct

Participation in this project is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating you agree to uphold its terms.
