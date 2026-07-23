# Recoil DevTools Themes

[![npm](https://img.shields.io/npm/v/recoil-devtools-themes.svg)](https://npmjs.com/package/recoil-devtools-themes)
[![Downloads](https://img.shields.io/npm/dm/recoil-devtools-themes.svg)](https://npmjs.com/package/recoil-devtools-themes)
[![Discord](https://img.shields.io/discord/1527933660764831825?label=Discord&logo=discord&logoColor=white)](https://discord.gg/bR5VyATgka)

Color themes for Recoil DevTools. Includes Base16 themes and custom themes.

## Installation

```sh
pnpm add recoil-devtools-themes
```

## Usage

```tsx
import * as themes from 'recoil-devtools-themes';

const colors = themes.ulisesjcf;
```

## Available Themes

- `apath`, `base8`, `base16`, `base16light`, `bespin`, `brewer`, `bright`, `chalk`
- `codeschool`, `dracula`, `duotone`, `eighties`, `embedded`, `emacs`, `flat`
- `github`, `google`, `grayscale`, `greenscreen`, `harmonic`, `hopper`, `horizon`
- `ice`, `inspired`, `irblack`, `lattice`, `lucario`, `material`, `mexico`, `monokai`
- `new`, `nord`, `ocean`, `one-light`, `outer`, `panda`, `paraiso`, `pop`
- `railscasts`, `recoil`, `rose`, `seti`, `shapeshifter`, `slate`, `solarized`
- `spaceduck`, `spoon`, `sunburst`, `tomorrow`, `tomorrownight`, `tomorrownightblue`
- `tomorrownightbright`, `twilight`, `ulisesjcf`, `vascular`, `vice`, `xcode`

## Theme Format

```ts
interface Base16Theme {
  scheme: string;
  author: string;
  base00: string; // Background
  base01: string; // Selection
  base02: string; // Comments
  base03: string; // Dark comments
  base04: string; // Medium comments
  base05: string; // Light comments
  base06: string; // Light text
  base07: string; // Foreground
  base08: string; // Red
  base09: string; // Orange
  base0A: string; // Yellow
  base0B: string; // Green
  base0C: string; // Cyan
  base0D: string; // Blue
  base0E: string; // Magenta
  base0F: string; // Pink
}
```

## Demo

A live, runnable demo using all packages lives in [`recoil-devtools-demo/`](../../recoil-devtools-demo) (Vite + React 18). Run it locally:

```sh
cd recoil-devtools-demo && pnpm install && pnpm dev
```

Or try it online: <https://ulises-jeremias.github.io/recoil-devtools/>

## License

[MIT](./LICENSE)
