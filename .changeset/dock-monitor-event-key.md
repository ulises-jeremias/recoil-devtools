---
'recoil-devtools-dock': patch
---

Fix `DockMonitor` keyboard shortcut matching to use the modern `KeyboardEvent.key` value instead of the deprecated `keyCode`/`which` properties, so non-alphabetic shortcuts (e.g. `ctrl-enter`, `ctrl-space`) work correctly.
