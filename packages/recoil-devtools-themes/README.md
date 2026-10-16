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

## Exports

This package exports no React component — it is a plain object of Base16 themes.
Import the whole namespace (`import * as themes from 'recoil-devtools-themes'`),
or a single theme by name. `keyof typeof themes` is exactly these eight:

| Export           | Type          | `scheme`             | `author`                                    |
| ---------------- | ------------- | -------------------- | ------------------------------------------- |
| `dracula`        | `Base16Theme` | Dracula              | clach04                                     |
| `gruvbox`        | `Base16Theme` | Gruvbox dark, medium | Dawid Kurek, morhetz                        |
| `monokai`        | `Base16Theme` | Monokai              | Wimer Hazenberg                             |
| `nord`           | `Base16Theme` | Nord                 | arcticicestudio                             |
| `ocean`          | `Base16Theme` | Ocean                | Chris Kempson                               |
| `solarized`      | `Base16Theme` | Solarized Dark       | Ethan Schoonover (modified by aramisgithub) |
| `solarizedLight` | `Base16Theme` | Solarized Light      | Ethan Schoonover (modified by aramisgithub) |
| `ulisesjcf`      | `Base16Theme` | ulises-jeremias      | ulises-jeremias                             |

Each theme is the default export of its module, and every one of them carries all
16 `base00`-`base0F` slots plus `scheme` and `author`.

These are the names accepted by the `theme` prop of
[`<LogMonitor>`](../recoil-devtools-log-monitor#theme); any other name warns and
falls back to `ulisesjcf`.

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
