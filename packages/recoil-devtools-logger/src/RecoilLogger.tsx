import React, { FC } from 'react';
import { RecoilState } from 'recoil';

export interface RecoilDevtoolsProps {
  values?: RecoilState<any>[];
}

const RecoilDevtools: FC<RecoilDevtoolsProps> = ({ values }) => {
  return null;
};

export default RecoilDevtools;
