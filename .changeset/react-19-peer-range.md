---
'recoil-devtools': patch
'recoil-devtools-dock': patch
'recoil-devtools-log-monitor': patch
'recoil-devtools-logger': patch
'recoil-devtools-themes': patch
---

Widen React peer range to `>=17 <20` to allow React 19. Verified with a production Vite build of RecoilRoot + atom + useRecoilState on React 19.2 with recoil 0.7.7 (no runtime break observed at build level).
