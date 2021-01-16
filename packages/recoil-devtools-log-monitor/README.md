# Recoil DevTools Log Monitor

The default monitor for [Recoil DevTools](https://github.com/ulises-jeremias/recoil-devtools) with a tree view.
It shows a log of states and actions, and lets you change their history.

### Installation

```
yarn add --dev recoil-devtools-log-monitor
```

### Usage

You can use `LogMonitor` as the only monitor in your app:

Typescript types are also available.

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { atom, selector, RecoilRoot } from 'recoil';
import LogMonitor from 'recoil-devtools-log-monitor';

const a = atom({
  /* ... */
});
const b = selector({
  /* ... */
});
const c = atom({
  /* ... */
});

const App = () => (
  <RecoilRoot>
    {/* logs for related recoil values "a" and "b" */}
    <LogMonitor values={[a, b]} />

    {/* another logger for recoil value "c" */}
    <LogMonitor values={[c]} />

    {/* logger for all atoms and selectors under <RecoilRoot /> */}
    <LogMonitor />

    {/* code ... */}
  </RecoilRoot>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

[Read how to start using Recoil DevTools.](https://github.com/ulises-jeremias/recoil-devtools)

### Features

Every mutation is displayed in the log. You can expand the tree view to inspect the `payload` object and the `state` after it.

Clicking an action will disable it. It will appear crossed out, and the state will be recalculated as if the action never happened. Clicking it once again will enable it back. Use this together with a hot reloading solution to work sequentially on different states of your app without reproducing them by hand. You can toggle any action except for the initial one.

There are four buttons at the very top. `Reset` takes your app to the state you created the store with. The other three buttons work together. You might find it useful to think of them like you think of Git commits. `Commit` removes all actions in your log, and makes the current state your initial state. This is useful when you start working on a feature and want to remove the previous noise. After you’ve dispatched a few actions, you can press `Revert` to go back to the last committed state. Finally, if you dispatched some actions by mistake and you don’t want them around, you can toggle them by clicking on them, and press `Sweep` to completely remove all currently disabled actions from the log.

### Props

| Name                | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme`             | Either a string referring to one of the themes provided by [recoil-devtools-themes](https://github.com/ulises-jeremias/recoil-devtools/blob/master/packages/recoil-devtools-themes) (feel free to contribute!) or a custom object of the same format. Optional. By default, set to [`'ulisesjcf'`](https://github.com/ulises-jeremias/recoil-devtools/blob/master/packages/recoil-devtools-themes/src/ulisesjcf.js). |
| `select`            | A function that selects the slice of the state for DevTools to show. For example, `state => state.thePart.iCare.about`. Optional. By default, set to `state => state`.                                                                                                                                                                                                                                               |
| `preserveScrollTop` | When `true`, records the current scroll top every second so it can be restored on refresh. This only has effect when used together with `persistState()` enhancer from Recoil DevTools. By default, set to `true`.                                                                                                                                                                                                   |
| `expandActionRoot`  | When `true`, displays the action object expanded rather than collapsed. By default, set to `true`.                                                                                                                                                                                                                                                                                                                   |
| `expandStateRoot`   | When `true`, displays the state object expanded rather than collapsed. By default, set to `true`.                                                                                                                                                                                                                                                                                                                    |
| `markStateDiff`     | When `true`, mark the state's values which were changed comparing to the previous state. It affects the performance significantly! You might also want to set `expandStateRoot` to `true` as well when enabling it. By default, set to `false`.                                                                                                                                                                      |
| `hideMainButtons`   | When `true`, will show only the logs without the top button bar. By default, set to `false`.                                                                                                                                                                                                                                                                                                                         |

### License

MIT
