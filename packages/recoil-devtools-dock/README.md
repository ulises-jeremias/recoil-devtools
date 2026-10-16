# Recoil DevTools Dock Monitor

[![npm](https://img.shields.io/npm/v/recoil-devtools-dock.svg)](https://npmjs.com/package/recoil-devtools-dock)
[![Downloads](https://img.shields.io/npm/dm/recoil-devtools-dock.svg)](https://npmjs.com/package/recoil-devtools-dock)
[![Discord](https://img.shields.io/discord/1527933660764831825?label=Discord&logo=discord&logoColor=white)](https://discord.gg/bR5VyATgka)

A resizable and movable dock for Recoil DevTools, powered by [React Dock](https://github.com/alexkuz/react-dock).

## Installation

```sh
pnpm add recoil-devtools-dock
```

## Usage

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
    </RecoilRoot>
  );
}
```

## Props

| Prop                  | Type                                     | Default    | Description                                                                                         |
| --------------------- | ---------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `children`            | `ReactNode`                              | —          | Monitors rendered inside the dock. At least one is required                                         |
| `values`              | `RecoilState<unknown>[]`                 | —          | Atoms forwarded to the active child monitor. The child's own `values` wins                          |
| `defaultIsVisible`    | `boolean`                                | `true`     | Initial visibility, when nothing has been persisted yet                                             |
| `defaultPosition`     | `'left' \| 'top' \| 'right' \| 'bottom'` | `"right"`  | Initial dock position, when nothing has been persisted yet                                          |
| `defaultSize`         | `number`                                 | `0.3`      | Initial dock size                                                                                   |
| `toggleVisibilityKey` | `string`                                 | `"ctrl-h"` | Key to toggle visibility                                                                            |
| `changePositionKey`   | `string`                                 | `"ctrl-q"` | Key to change dock position                                                                         |
| `changeMonitorKey`    | `string`                                 | `"ctrl-m"` | Key to switch between the child monitors                                                            |
| `fluid`               | `boolean`                                | `true`     | Size dock as a fraction of the viewport instead of a fixed value                                    |
| `persistState`        | `boolean`                                | `true`     | Save and restore visibility, position and size in `localStorage` under `recoil-devtools-dock-state` |
| `showShortcutButton`  | `boolean`                                | `true`     | Show the ⌨ button that lists the active shortcuts                                                   |

Keys are parsed by [`parse-key`](https://www.npmjs.com/package/parse-key), which
expects `"c"`, `"ctrl-c"` or `"shift-ctrl-c"`; modifiers (`ctrl`, `alt`, `shift`,
`meta`) are all required to match, and an unparseable value throws inside the
global `keydown` handler.

## Keyboard Shortcuts

| Shortcut | Action            |
| -------- | ----------------- |
| `Ctrl+H` | Toggle visibility |
| `Ctrl+Q` | Change position   |
| `Ctrl+M` | Change monitor    |

Click the ⌨ button in the dock to see available shortcuts.

## Multiple Monitors

```tsx
<DockMonitor changeMonitorKey="ctrl-m">
  <LogMonitor />
  <Inspector />
</DockMonitor>
```

## Demo

A live, runnable demo using all packages lives in [`recoil-devtools-demo/`](../../recoil-devtools-demo) (Vite + React 18). Run it locally:

```sh
cd recoil-devtools-demo && pnpm install && pnpm dev
```

Or try it online: <https://ulises-jeremias.github.io/recoil-devtools/>

## License

[MIT](./LICENSE)
