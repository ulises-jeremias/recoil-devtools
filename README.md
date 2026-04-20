# Recoil DevTools

[![CI](https://github.com/ulises-jeremias/recoil-devtools/actions/workflows/ci.yml/badge.svg)](https://github.com/ulises-jeremias/recoil-devtools/actions)
[![npm version](https://img.shields.io/npm/v/recoil-devtools.svg)](https://www.npmjs.com/package/recoil-devtools)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Developer Tools to power-up [Recoil](https://recoiljs.org/) development workflow.

Recoil DevTools provides a complete set of debugging tools for Recoil-based applications, including:

- **Logger**, to log state changes to console
- **Log Monitor**, to visualize state history with time-travel
- **Dock Monitor**, to display devtools in a resizable panel

## Features

- **Time-travel debugging** - Navigate through state history
- **State diffing** - Visualize what changed between states
- **Action toggle** - Enable/disable actions to test scenarios
- **Keyboard shortcuts** - Quick access to toggle visibility and more
- **Persistent state** - Remember dock position between sessions
- **Modern stack** - Built with React 18, TypeScript 5, and Vite

## Packages

This is a monorepo containing the following packages:

| Package                                                               | Description                           | npm                                                                                        |
| --------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`recoil-devtools`](packages/recoil-devtools)                         | Main package with composited DevTools | [`recoil-devtools`](https://www.npmjs.com/package/recoil-devtools)                         |
| [`recoil-devtools-logger`](packages/recoil-devtools-logger)           | Console logging                       | [`recoil-devtools-logger`](https://www.npmjs.com/package/recoil-devtools-logger)           |
| [`recoil-devtools-log-monitor`](packages/recoil-devtools-log-monitor) | State history UI                      | [`recoil-devtools-log-monitor`](https://www.npmjs.com/package/recoil-devtools-log-monitor) |
| [`recoil-devtools-dock`](packages/recoil-devtools-dock)               | Dock container                        | [`recoil-devtools-dock`](https://www.npmjs.com/package/recoil-devtools-dock)               |
| [`recoil-devtools-themes`](packages/recoil-devtools-themes)           | Color themes                          | [`recoil-devtools-themes`](https://www.npmjs.com/package/recoil-devtools-themes)           |

## Quick Start

```bash
# Install all packages
pnpm install

# Run the demo
pnpm dev
```

### Basic Usage

```tsx
import { RecoilRoot } from 'recoil';
import { DockMonitor } from 'recoil-devtools-dock';
import { LogMonitor } from 'recoil-devtools-log-monitor';

function App() {
  return (
    <RecoilRoot>
      <DockMonitor>
        <LogMonitor />
      </DockMonitor>
      {/* Your app */}
    </RecoilRoot>
  );
}
```

### Keyboard Shortcuts

| Shortcut | Action                         |
| -------- | ------------------------------ |
| `Ctrl+H` | Toggle visibility              |
| `Ctrl+Q` | Change dock position           |
| `Ctrl+M` | Change monitor (when multiple) |

## Requirements

- Node.js 18+
- React 18+
- Recoil 0.7+

## License

[MIT](LICENSE)
