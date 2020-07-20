import React, { FC } from 'react';

import { RecoilDevtools } from 'recoil-devtools';
import { RecoilLogger } from 'recoil-devtools-logger';

import { commonNotification } from '../../state';

const Devtools: FC<void> = () => {
  return (
    <RecoilDevtools values={[commonNotification]}>
      <RecoilLogger />
    </RecoilDevtools>
  );
};

export default Devtools;
