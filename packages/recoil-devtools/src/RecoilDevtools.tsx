import React, { FC } from 'react';
import { useRecoilTransactionObserver_UNSTABLE } from 'recoil';

export interface RecoilDevtoolsProps { };

const RecoilDevtools: FC<RecoilDevtoolsProps> = () => {
  useRecoilTransactionObserver_UNSTABLE(({ snapshot, previousSnapshot }) => {

  });

  return null;
};

export default RecoilDevtools;
