# Recoil DevTools Themes

A repository of different color schemes for Recoil DevTools monitors. Any Recoil DevTools monitor can use these.

Currently, most of these are [Base16 themes](https://github.com/gaearon/base16-js). However, there is an additional `ulises-jeremias` theme designed by [Nic Aitch](http://nicinabox.com/) for Redux DevTools and ported by [Ulises Jeremias](https://github.com/ulises-jeremias) for Recoil DevTools. In the future, we might want to remove some of the themes that don’t work with Recoil DevTools well, or add more custom themes, so that’s the justification for a separate package.

## Installation

```
yarn add recoil-devtools-themes
```

## Usage

```js
import * as themes from 'recoil-devtools-themes';

// somewhere in your monitor component
const colors = themes[this.props.theme];
return <div style={{ color: colors.base00 }}>...</div>;
```

## License

MIT
