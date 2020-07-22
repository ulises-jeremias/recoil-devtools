# Recoil Devtools

[![npm](https://img.shields.io/npm/v/recoil-devtools.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/recoil-devtools)
[![npm](https://img.shields.io/npm/dm/recoil-devtools.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/recoil-devtools)

## Table of contents

- [Install](#install)
- [Usage](#usage)
- [To Do](#to-do)
- [License](#license)

## Install

```sh
$ yarn add recoil-devtools
```

Typescript types are also available.

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { atom, selector, RecoilRoot } from 'recoil';
import { RecoilDevtools } from 'recoil-devtools';
import { RecoilLogger } from 'recoil-devtools-logger';

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
    <RecoilDevtools values={[a, b]}>
      {/* logs for related recoil values "a" and "b" */}
      <RecoilLogger />
    </RecoilDevtools>

    {/* code ... */}
  </RecoilRoot>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

## To Do

- [ ] Clean up code, because it's very messy, to be honest
- [ ] Write tests

Feel free to create PR for any of those tasks!

## License

[MIT](./LICENSE)
