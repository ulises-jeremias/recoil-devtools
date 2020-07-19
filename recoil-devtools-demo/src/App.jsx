import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from 'react-router-dom';

import 'app/styles/custom/main.less';

import Loading from 'app/components/Loading';
import MomentLocale from 'app/components/MomentLocale';
import AppRoutes from 'app/routes/AppRoutes';

import 'app/i18n';

const App = () => (
  <RecoilRoot>
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <MomentLocale />
        <AppRoutes />
      </BrowserRouter>
    </Suspense>
  </RecoilRoot>
);

export default App;
