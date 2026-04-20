# Recoil Logger

[![npm](https://img.shields.io/npm/v/recoil-devtools-logger.svg)](https://npmjs.com/package/recoil-devtools-logger)
[![Downloads](https://img.shields.io/npm/dm/recoil-devtools-logger.svg)](https://npmjs.com/package/recoil-devtools-logger)

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

| Prop        | Type            | Default                     | Description |
| ----------- | --------------- | --------------------------- | ----------- |
| `values`    | `RecoilState[]` | Specific atoms to track     |
| `predicate` | `Function`      | Filter which actions to log |
| `collapsed` | `boolean`       | Collapse log groups         |
| `duration`  | `boolean`       | Print action duration       |
| `timestamp` | `boolean`       | Print timestamp             |
| `level`     | `string`        | Log level                   |
| `colors`    | `object`        | Custom colors               |
| `logger`    | `object`        | Custom logger               |

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

## License

[MIT](./LICENSE)
