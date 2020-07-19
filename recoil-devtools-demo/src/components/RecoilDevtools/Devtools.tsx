import React, { FC } from 'react';

import RecoilDevtools from './RecoilDevtools';

import { commonNotification } from '../../state';

const Devtools: FC<void> = () => {
  return (
    <RecoilDevtools values={[commonNotification]} />
  );
};

export default Devtools;
