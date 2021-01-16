[![Build Status](https://github.com/ulises-jeremias/recoil-devtools/workflows/CI/badge.svg)](https://github.com/ulises-jeremias/recoil-devtools/commits/master)

# Recoil DevTools

Developer Tools to power-up [Recoil](https://recoiljs.org/) development workflow or any other architecture which handles the state change (see [integrations](#integrations)).

> Note that this repository is work in progress.

### Integrations

- [Recoil Logger](./packages/recoil-devtools-logger) is a recoil logging tool that lets you replay problems as if they happened in your own browser. This devtool is based on [redux-logger](https://github.com/LogRocket/redux-logger), but implemented for recoil in the react way.

- [Recoil Log Monitor](./packages/recoil-devtools-log-monitor) is a recoil logging tool that shows a log of states and actions, and lets you change their history. This devtool is based on [redux-devtools-log-monitor](https://github.com/gaearon/redux-devtools-log-monitor), but implemented for recoil in the react way.

### License

MIT
