# Recoil Logger

[![npm](https://img.shields.io/npm/v/recoil-devtools-logger.svg)](https://npmjs.com/package/recoil-devtools-logger)
[![Downloads](https://img.shields.io/npm/dm/recoil-devtools-logger.svg)](https://npmjs.com/package/recoil-devtools-logger)
[![Discord](https://img.shields.io/discord/1527933660764831825?label=Discord&logo=discord&logoColor=white)](https://discord.gg/bR5VyATgka)

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

## Exports

| Export         | Type                            | Description                                            |
| -------------- | ------------------------------- | ------------------------------------------------------ |
| `RecoilLogger` | `FC<RecoilLoggerProps>`         | Component that observes Recoil transactions            |
| `createLogger` | `(options?: Options) => Logger` | Builds the curried logger passed to `logger`           |
| `logger`       | `Logger`                        | The default logger, `createLogger()` with no options   |
| `defaults`     | `object`                        | The default `Options` merged into every `createLogger` |

## Props

`<RecoilLogger>` renders `null`; it only observes transactions.

| Prop                | Type                   | Default                       | Description                                                                            |
| ------------------- | ---------------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
| `values`            | `RecoilState<any>[]`   | All modified atoms            | Atoms to read on each transaction. When empty, every node reported as modified is read |
| `logger`            | `Logger`               | `createLogger()`              | `(next) => ({ prevState, nextState, action }) => any`                                  |
| `actionTransformer` | `(action: any) => any` | `(action) => ({ ...action })` | Rewrites the action object handed to `logger`                                          |

The action passed down is `{ description: "Updated keys: <keys>", <atomKey>: <nextValue> }`,
and the entry is `{ prevState, nextState, action }`.

`RecoilLoggerProps` also declares `next?: Function`, but the component never reads
it: it always invokes `logger(() => null)`, so there is no way to chain a `next`
through `<RecoilLogger>`.

## `createLogger()` options

These belong to `createLogger`, not to `<RecoilLogger>`. Every option is optional
and is merged over `defaults`.

| Option              | Type                  | Default              | Description                                                         |
| ------------------- | --------------------- | -------------------- | ------------------------------------------------------------------- |
| `level`             | `LogLevel`            | `() => "log"`        | `console` method: a string, a function, or an object keyed by type  |
| `logger`            | `object`              | `console`            | Implementation of the `console` API. If `undefined`, nothing logs   |
| `predicate`         | `Function`            | `false`              | `(state, action) => boolean`; `state` is `{ prevState, nextState }` |
| `collapsed`         | `Function`            | `false`              | `(getState, action, logEntry) => boolean`; group collapsed?         |
| `logErrors`         | `boolean \| Function` | `true`               | Catch, log and re-throw errors thrown by `next`                     |
| `duration`          | `boolean`             | `true`               | Print how long each transaction took                                |
| `timestamp`         | `boolean`             | `true`               | Print a timestamp with each entry                                   |
| `colors`            | `object`              | (built-in palette)   | `title`, `prevState`, `action`, `nextState`, `error` color getters  |
| `stateTransformer`  | `Function`            | `(state) => state`   | Transform the state before printing                                 |
| `actionTransformer` | `Function`            | `(action) => action` | Transform the action before printing                                |
| `errorTransformer`  | `Function`            | `(error) => error`   | Transform the error before printing                                 |
| `diff`              | `boolean`             | `false`              | Print a `deep-diff` of previous vs next state below the entry       |
| `diffPredicate`     | `Function`            | `() => false`        | `(nextState, action) => boolean`; per-entry override of `diff`      |

## Custom Logger

```tsx
import { RecoilLogger, createLogger } from 'recoil-devtools-logger';

const logger = createLogger({
  // Actions only carry `description` and one entry per atom key, so filter on those
  predicate: (state, action) => action.description.includes('count'),
  collapsed: () => true,
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
