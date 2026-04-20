# Recoil DevTools Log Monitor

[![npm](https://img.shields.io/npm/v/recoil-devtools-log-monitor.svg)](https://npmjs.com/package/recoil-devtools-log-monitor)
[![Downloads](https://img.shields.io/npm/dm/recoil-devtools-log-monitor.svg)](https://npmjs.com/package/recoil-devtools-log-monitor)

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

| Prop               | Type            | Default                  | Description |
| ------------------ | --------------- | ------------------------ | ----------- |
| `values`           | `RecoilState[]` | Specific atoms to track  |
| `select`           | `Function`      | Select state slice       |
| `theme`            | `string`        | Color theme              |
| `expandActionRoot` | `boolean`       | Expand action by default |
| `expandStateRoot`  | `boolean`       | Expand state by default  |
| `markStateDiff`    | `boolean`       | Show state changes       |
| `hideMainButtons`  | `boolean`       | Hide button bar          |

## Theme

Available themes: `apath`, `base8`, `base16`, `base16light`, `bespin`, `brewer`, `bright`, `chalk`, `codeschool`, `dracula`, `duotone`, `eighties`, `embedded`, `emacs`, `flat`, `github`, `google`, `grayscale`, `greenscreen`, `harmonic`, `hopper`, `horizon`, `ice`, `inspired`, `irblack`, `lattice`, `lucario`, `material`, `mexico`, `monokai`, `new`, `nord`, `ocean`, `one-light`, `outer`, `panda`, `paraiso`, `pop`, `railscasts`, `recoil`, `rose`, `seti`, `shapeshifter`, `slate`, `solarized`, `spaceduck`, `spoon`, `sunburst`, `tomorrow`, `tomorrownight`, `tomorrownightblue`, `tomorrownightbright`, `twilight`, `ulisesjcf`, `vascular`, `vice`, `xcode`.

## License

[MIT](./LICENSE)
