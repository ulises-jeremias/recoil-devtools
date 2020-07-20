import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';

import 'app/styles/custom/main.less';

import Loading from 'app/components/Loading';
import MomentLocale from 'app/components/MomentLocale';
import Notification from 'app/components/Notification';
import AppRoutes from 'app/routes/AppRoutes';

import { Devtools } from 'app/components/Devtools';

import 'app/i18n';

const App = () => (
  <RecoilRoot>
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Devtools />
        <Notification />
        <MomentLocale />
        <AppRoutes />
      </BrowserRouter>
    </Suspense>
  </RecoilRoot>
);

export default App;
