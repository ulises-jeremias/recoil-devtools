# Recoil DevTools Dock Monitor

[![npm](https://img.shields.io/npm/v/recoil-devtools-dock.svg)](https://npmjs.com/package/recoil-devtools-dock)
[![Downloads](https://img.shields.io/npm/dm/recoil-devtools-dock.svg)](https://npmjs.com/package/recoil-devtools-dock)

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

| Prop                  | Type        | Default                             | Description                    |
| --------------------- | ----------- | ----------------------------------- | ------------------------------ |
| `children`            | `ReactNode` | (required) Child monitor components |
| `toggleVisibilityKey` | `string`    | `"ctrl-h"`                          | Key to toggle visibility       |
| `changePositionKey`   | `string`    | `"ctrl-q"`                          | Key to change dock position    |
| `changeMonitorKey`    | `string`    | `"ctrl-m"`                          | Key to switch monitors         |
| `fluid`               | `boolean`   | `true`                              | Size as fraction vs fixed      |
| `defaultSize`         | `number`    | `0.3`                               | Dock size                      |
| `defaultPosition`     | `Position`  | `"right"`                           | Dock position                  |
| `defaultIsVisible`    | `boolean`   | `true`                              | Initial visibility             |
| `persistState`        | `boolean`   | `true`                              | Persist to localStorage        |
| `showShortcutButton`  | `boolean`   | `true`                              | Show keyboard shortcuts button |

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

## License

[MIT](./LICENSE)
