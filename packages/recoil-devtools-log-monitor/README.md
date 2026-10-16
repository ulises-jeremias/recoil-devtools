# Recoil DevTools Log Monitor

[![npm](https://img.shields.io/npm/v/recoil-devtools-log-monitor.svg)](https://npmjs.com/package/recoil-devtools-log-monitor)
[![Downloads](https://img.shields.io/npm/dm/recoil-devtools-log-monitor.svg)](https://npmjs.com/package/recoil-devtools-log-monitor)
[![Discord](https://img.shields.io/discord/1527933660764831825?label=Discord&logo=discord&logoColor=white)](https://discord.gg/bR5VyATgka)

A log monitor for Recoil DevTools that displays state history with time-travel capability.

## Installation

```sh
pnpm add recoil-devtools-log-monitor
```

## Usage

```tsx
import { RecoilRoot } from 'recoil';
import { LogMonitor } from 'recoil-devtools-log-monitor';
import { atom } from 'recoil';

const countAtom = atom({
  key: 'count',
  default: 0,
});

function App() {
  return (
    <RecoilRoot>
      <LogMonitor values={[countAtom]} />
    </RecoilRoot>
  );
}
```

## Features

- **Time-travel** - Click any action to toggle it on/off
- **State history** - Navigate through state changes
- **State diffing** - Visualize what changed between states
- **Tree view** - Expand/collapse state objects
- **Initial state capture** - Records initial state on mount

### Buttons

| Button     | Action                                   |
| ---------- | ---------------------------------------- |
| **Reset**  | Return to initial state                  |
| **Revert** | Go to last committed state               |
| **Commit** | Make current state the new initial state |
| **Sweep**  | Remove all disabled actions              |

Click any action to toggle it. Disabled actions are crossed out and state is recalculated as if the action never happened.

## Props

| Prop               | Type                                 | Default       | Description                                                                 |
| ------------------ | ------------------------------------ | ------------- | --------------------------------------------------------------------------- |
| `values`           | `RecoilState<any>[]`                 | All atoms     | Atoms to track. When empty, every node modified by a transaction is tracked |
| `select`           | `(state: any) => unknown`            | `s => s`      | Select the state slice to display                                           |
| `theme`            | `keyof typeof themes \| Base16Theme` | `"ulisesjcf"` | Theme name from `recoil-devtools-themes`, or a full Base16 theme object     |
| `expandActionRoot` | `boolean`                            | `true`        | Expand the action tree by default                                           |
| `expandStateRoot`  | `boolean`                            | `true`        | Expand the state tree by default                                            |
| `markStateDiff`    | `boolean`                            | `false`       | Highlight state changes between actions                                     |
| `hideMainButtons`  | `boolean`                            | `false`       | Hide the Reset / Revert / Commit / Sweep bar                                |

`<LogMonitor>` is the only export of this package; the button bar and the entry
list are internal and are not exported.

### Selecting state

The `select` callback receives an object keyed by atom names. Atom values can have
different types, and a transaction can contain only modified atoms. Check the
value before using a specific type, for example:

```tsx
<LogMonitor
  select={(state: Record<string, unknown>) =>
    typeof state.count === 'number' ? state.count : undefined
  }
/>
```

## Theme

`theme` accepts any named export of
[`recoil-devtools-themes`](../recoil-devtools-themes): `dracula`, `gruvbox`,
`monokai`, `nord`, `ocean`, `solarized`, `solarizedLight`, `ulisesjcf`.

A name that is not exported logs `DevTools theme <name> not found, defaulting to
ulisesjcf` and falls back to `ulisesjcf`. To use any other palette, pass a
[`Base16Theme`](../recoil-devtools-themes#theme-format) object directly instead
of a name.

## Demo

A live, runnable demo using all packages lives in [`recoil-devtools-demo/`](../../recoil-devtools-demo) (Vite + React 18). Run it locally:

```sh
cd recoil-devtools-demo && pnpm install && pnpm dev
```

Or try it online: <https://ulises-jeremias.github.io/recoil-devtools/>

## License

[MIT](./LICENSE)
