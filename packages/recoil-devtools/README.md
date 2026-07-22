# Recoil DevTools

[![npm](https://img.shields.io/npm/v/recoil-devtools.svg)](https://npmjs.com/package/recoil-devtools)
[![Downloads](https://img.shields.io/npm/dm/recoil-devtools.svg)](https://npmjs.com/package/recoil-devtools)
[![Discord](https://img.shields.io/discord/1527933660764831825?label=Discord&logo=discord&logoColor=white)](https://discord.gg/dwFTsR7fK2)

A composited DevTools component that combines [DockMonitor](recoil-devtools-dock) and [LogMonitor](recoil-devtools-log-monitor) in a single component.

## Installation

```sh
pnpm add recoil-devtools
```

## Usage

```tsx
import { RecoilRoot } from 'recoil';
import { RecoilDevtools } from 'recoil-devtools';
import { atom } from 'recoil';

const countAtom = atom({
  key: 'count',
  default: 0,
});

function App() {
  return (
    <RecoilRoot>
      <RecoilDevtools values={[countAtom]} />
      {/* Your app */}
    </RecoilRoot>
  );
}
```

## Props

| Prop               | Type            | Default       | Description             |
| ------------------ | --------------- | ------------- | ----------------------- |
| `values`           | `RecoilState[]` | All atoms     | Specific atoms to track |
| `theme`            | `string`        | `"ulisesjcf"` | Color theme             |
| `defaultIsVisible` | `boolean`       | `true`        | Initial visibility      |
| `defaultPosition`  | `Position`      | `"right"`     | Dock position           |

## Theme

Available themes: `apath`, `base8`, `base16`, `base16light`, `bespin`, `brewer`, `bright`, `chalk`, `codeschool`, `dracula`, `duotone`, `eighties`, `embedded`, `emacs`, `flat`, `github`, `google`, `grayscale`, `greenscreen`, `harmonic`, `hopper`, `horizon`, `ice`, `inspired`, `irblack`, `lattice`, `lucario`, `material`, `mexico`, `monokai`, `new`, `nord`, `ocean`, `one-light`, `outer`, `panda`, `paraiso`, `pop`, `railscasts`, `recoil`, `rose`, `seti`, `shapeshifter`, `slate`, `solarized`, `spaceduck`, `spoon`, `sunburst`, `tomorrow`, `tomorrownight`, `tomorrownightblue`, `tomorrownightbright`, `twilight`, `ulisesjcf`, `vascular`, `vice`, `xcode`.

## Demo

A live, runnable demo using all packages lives in [`recoil-devtools-demo/`](../../recoil-devtools-demo) (Vite + React 18). Run it locally:

```sh
cd recoil-devtools-demo && pnpm install && pnpm dev
```

Or try it online: <https://ulises-jeremias.github.io/recoil-devtools/>

## License

[MIT](./LICENSE)
