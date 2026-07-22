# Recoil Logger

[![npm](https://img.shields.io/npm/v/recoil-devtools-logger.svg)](https://npmjs.com/package/recoil-devtools-logger)
[![Downloads](https://img.shields.io/npm/dm/recoil-devtools-logger.svg)](https://npmjs.com/package/recoil-devtools-logger)
[![Discord](https://img.shields.io/discord/1527933660764831825?label=Discord&logo=discord&logoColor=white)](https://discord.gg/dwFTsR7fK2)

A logging tool for Recoil that prints state changes to the console.

## Installation

```sh
pnpm add recoil-devtools-logger
```

## Usage

```tsx
import { RecoilRoot } from 'recoil';
import { RecoilLogger } from 'recoil-devtools-logger';
import { atom } from 'recoil';

const countAtom = atom({
  key: 'count',
  default: 0,
});

function App() {
  return (
    <RecoilRoot>
      <RecoilLogger values={[countAtom]} />
    </RecoilRoot>
  );
}
```

## Props

| Prop        | Type            | Default    | Description                                  |
| ----------- | --------------- | ---------- | -------------------------------------------- |
| `values`    | `RecoilState[]` | All atoms  | Specific atoms to track                      |
| `predicate` | `Function`      | `false`    | Filter which actions to log                  |
| `collapsed` | `boolean`       | `false`    | Collapse log groups in the console           |
| `duration`  | `boolean`       | `true`     | Print duration of each action                |
| `timestamp` | `boolean`       | `true`     | Print timestamp with each action             |
| `level`     | `string`        | `"log"`    | Console method to use (`log`, `warn`, etc.)  |
| `colors`    | `object`        | (built-in) | Custom title / state / action colors         |
| `logger`    | `object`        | `console`  | Custom logger implementing the `console` API |

## Custom Logger

```tsx
import { RecoilLogger, createLogger } from 'recoil-devtools-logger';

const logger = createLogger({
  predicate: (_, action) => action.type !== 'HIDDEN',
  collapsed: true,
});

<RecoilLogger logger={logger} />;
```

## Recipes

### Development Only

```tsx
{
  process.env.NODE_ENV === 'development' && <RecoilLogger values={[atom]} />;
}
```

### Custom Colors

```tsx
createLogger({
  colors: {
    title: () => 'purple',
    prevState: () => 'gray',
    action: () => 'blue',
    nextState: () => 'green',
  },
});
```

## Demo

A live, runnable demo using all packages lives in [`recoil-devtools-demo/`](../../recoil-devtools-demo) (Vite + React 18). Run it locally:

```sh
cd recoil-devtools-demo && pnpm install && pnpm dev
```

Or try it online: <https://ulises-jeremias.github.io/recoil-devtools/>

## License

[MIT](./LICENSE)
