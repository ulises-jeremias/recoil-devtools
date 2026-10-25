---
'recoil-devtools': patch
'recoil-devtools-dock': patch
'recoil-devtools-log-monitor': patch
'recoil-devtools-logger': patch
'recoil-devtools-themes': patch
---

Correct the Props and API tables in each package README so they match the exported components, defaults and theme names. Build with tsup 9: the published JavaScript is byte-identical, and the type declarations only switch to an equivalent `export type` form.
