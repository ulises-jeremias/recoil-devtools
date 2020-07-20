# Recoil Logger

[![npm](https://img.shields.io/npm/v/recoil-devtools-logger.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/recoil-devtools-logger)
[![npm](https://img.shields.io/npm/dm/recoil-devtools-logger.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/recoil-devtools-logger)

Recoil Logger is a recoil logging tool that lets you replay problems as if they happened in your own browser. This devtool is based on [redux-logger](https://github.com/LogRocket/redux-logger), but implemented for recoil in the react way.

## Table of contents

* [Install](#install)
* [Usage](#usage)
* [Options](#options)
* [Recipes](#recipes)
  * [Log only in development](#log-only-in-development)
  * [Log everything except actions with certain type](#log-everything-except-actions-with-certain-type)
  * [Collapse actions with certain type](#collapse-actions-with-certain-type)
  * [Log batched actions](#log-batched-actions)
* [To Do](#to-do)
* [License](#license)

## Install

```sh
$ yarn add recoil-devtools-logger
```

Typescript types are also available.

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { atom, selector, RecoilRoot } from 'recoil';
import { RecoilLogger } from 'recoil-devtools-logger';

const a = atom({ /* ... */ });
const b = selector({ /* ... */ });
const c = atom({ /* ... */ });

const App = () => (
  <RecoilRoot>
    {/* logs for related recoil values "a" and "b" */}
    <RecoilLogger values={[a, b]} />

    {/* another logger for recoil value "c" */}
    <RecoilLogger values={[c]} />

    {/* code ... */}
  </RecoilRoot>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

## Custom Logger

You can define your custom logger and pass it to the RecoilLogger in the followin way:

```jsx
...

import { RecoilLogger, createLogger } from 'recoil-devtools-logger';

const logger = createLogger({
  // options
});

const App = () => (
  <RecoilRoot>
    {/* logs for related recoil values */}
    <RecoilLogger
      values={[/* ... */]}
      logger={logger}
    />

    {/* ... */}
  </RecoilRoot>
);

...
```

### Options

```js
{
  predicate, // if specified this function will be called before each action is processed with this middleware.
  collapsed, // takes a Boolean or optionally a Function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.
  duration = false: Boolean, // print the duration of each action?
  timestamp = true: Boolean, // print the timestamp with each action?

  level = 'log': 'log' | 'console' | 'warn' | 'error' | 'info', // console's level

  colors: ColorsObject, // colors for title, prev state, action and next state: https://github.com/ulises-jeremias/recoil-devtools/blob/master/packages/recoil-devtools-logger/src/defaults.ts#L12-L18

  titleFormatter, // Format the title used when logging actions.

  stateTransformer, // Transform state before print. Eg. convert Immutable object to plain JSON.
  actionTransformer, // Transform action before print. Eg. convert Immutable object to plain JSON.
  errorTransformer, // Transform error before print. Eg. convert Immutable object to plain JSON.

  logger = console: LoggerObject, // implementation of the `console` API.
  logErrors = true: Boolean, // should the logger catch, log, and re-throw errors?

  diff = false: Boolean, // (alpha) show diff between states?
  diffPredicate, // (alpha) filter function for showing states diff, similar to `predicate`
}
```

### Options description

#### __level (string | Function | object)__

Level of `console`. `warn`, `error`, `info` or [else](https://developer.mozilla.org/en/docs/Web/API/console).

It can be a function `(action: object) => level: string`.

It can be an object with level string for: `prevState`, `action`, `nextState`, `error`

It can be an object with getter functions: `prevState`, `action`, `nextState`, `error`. Useful if you want to print
message based on specific state or action. Set any of them to `false` if you want to hide it.

* `prevState(prevState: object) => level: string`
* `action(action: object) => level: string`
* `nextState(nextState: object) => level: string`
* `error(error: any, prevState: object) => level: string`

*Default: `log`*

#### __duration (Boolean)__

Print duration of each action?

*Default: `false`*

#### __timestamp (Boolean)__

Print timestamp with each action?

*Default: `true`*

#### __colors (object)__

object with color getter functions: `title`, `prevState`, `action`, `nextState`, `error`. Useful if you want to paint
message based on specific state or action. Set any of them to `false` if you want to show plain message without colors.

* `title(action: object) => color: string`
* `prevState(prevState: object) => color: string`
* `action(action: object) => color: string`
* `nextState(nextState: object) => color: string`
* `error(error: any, prevState: object) => color: string`

#### __logger (object)__

Implementation of the `console` API. Useful if you are using a custom, wrapped version of `console`.

*Default: `console`*

#### __logErrors (Boolean)__

Should the logger catch, log, and re-throw errors? This makes it clear which action triggered the error but makes "break
on error" in dev tools harder to use, as it breaks on re-throw rather than the original throw location.

*Default: `true`*

#### __collapsed = ({ prevState, nextState }: object, action: object, logEntry: 
object) => Boolean__
Takes a boolean or optionally a function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.

*Default: `false`*

#### __predicate = ({ prevState, nextState }: object, action: object) => Boolean__

If specified this function will be called before each action is processed with this middleware.
Receives `getState` function for  accessing current store state and `action` object as parameters. Returns `true` if action should be logged, `false` otherwise.

*Default: `null` (always log)*

#### __stateTransformer = (state: object) => state__

Transform state before print. Eg. convert Immutable object to plain JSON.

*Default: identity function*

#### __actionTransformer = (action: object) => action__

Transform action before print. Eg. convert Immutable object to plain JSON.

*Default: identity function*

#### __errorTransformer = (error: any) => error__

Transform error before print.

*Default: identity function*

#### __titleFormatter = (action: object, time: string?, took: Number?) => title__

Format the title used for each action.

*Default: prints something like `action @ ${time} ${action.description} (in ${took.toFixed(2)} ms)`*

#### __diff (Boolean)__

Show states diff.

*Default: `false`*

#### __diffPredicate = ({ prevState, nextState }: object, action: object) => Boolean__

Filter states diff for certain cases.

*Default: `undefined`*

## Recipes

### Log only in development

```jsx
...

const App = () => (
  <RecoilRoot>
    {/* logs for related recoil values only in development */}
    {process.env.NODE_ENV === `development` && (
      <RecoilLogger values={[/* ... */]} />
    )}

    {/* ... */}
  </RecoilRoot>
);

...
```

### Log everything except actions with certain type

```js
import { createLogger } from 'recoil-devtools-logger';

createLogger({
  predicate: (_, action) => action.description !== AUTH_REMOVE_TOKEN
});
```

### Collapse actions with certain type

```js
import { createLogger } from 'recoil-devtools-logger';

createLogger({
  collapsed: (_, action) => action.description === FORM_CHANGE
});
```

### Collapse actions that don't have errors

```js
import { createLogger } from 'recoil-devtools-logger';

createLogger({
  collapsed: (_, action, logEntry) => !logEntry.error
});
```

### Log batched actions

```js
import { createLogger } from 'recoil-devtools-logger';

const actionTransformer = action => {
  if (action.description === 'BATCHING_TRANSACTION.BATCH') {
    action.payload.type = action.payload.map(next => next.type).join(' => ');
    return action.payload;
  }

  return action;
};

const level = 'info';

const logger = {};

for (const method in console) {
  if (typeof console[method] === 'function') {
    logger[method] = console[method].bind(console);
  }
}

logger[level] = function levelFn(...args) {
  const lastArg = args.pop();

  if (Array.isArray(lastArg)) {
    return lastArg.forEach(item => {
      console[level].apply(console, [...args, item]);
    });
  }

  console[level].apply(console, arguments);
};

export default createLogger({
  level,
  actionTransformer,
  logger,
});
```

## To Do

- [ ] Clean up code, because it's very messy, to be honest
- [ ] Write tests

Feel free to create PR for any of those tasks!

## License

[MIT](./LICENSE)
