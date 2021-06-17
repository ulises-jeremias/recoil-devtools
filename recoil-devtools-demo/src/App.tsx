import React, { Suspense } from 'react'
import { RecoilRoot } from 'recoil'
import { HashRouter } from 'react-router-dom'

import 'app/theme'

import Loading from 'app/components/Loading'
import MomentLocale from 'app/components/MomentLocale'
import Notification from 'app/components/Notification'
import AppRoutes from 'app/routes/AppRoutes'

import { Devtools } from 'app/components/Devtools'

import 'app/i18n'

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
