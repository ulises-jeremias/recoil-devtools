import React, { Suspense } from 'react'
import { RecoilRoot } from 'recoil'
import { HashRouter } from 'react-router-dom'

import 'theme'

import Loading from 'components/Loading'
import MomentLocale from 'components/MomentLocale'
import Notification from 'components/Notification'
import AppRoutes from 'routes/AppRoutes'

import { Devtools } from 'components/Devtools'

import 'i18n'

const App = () => (
  <RecoilRoot>
    <Suspense fallback={<Loading />}>
      <Devtools />
      <Notification />
      <MomentLocale />
      <HashRouter basename={process.env.PUBLIC_URL}>
        <AppRoutes />
      </HashRouter>
    </Suspense>
  </RecoilRoot>
)

export default App
