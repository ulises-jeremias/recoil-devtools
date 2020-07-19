import { FC } from 'react';
import { RecoilState, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import defaultLogger from '.';

export type Logger = (next: Function) => ({ prevState, nextState }: { prevState: any, nextState: any }) => any;

export interface RecoilDevtoolsProps {
  values?: RecoilState<any>[];
  logger?: Logger;
}

const RecoilDevtools: FC<RecoilDevtoolsProps> = ({ values, logger = defaultLogger }) => {
  useRecoilTransactionObserver_UNSTABLE(({ previousSnapshot, snapshot }) => {
    values?.map((value) => {
      previousSnapshot.getPromise(value).then(console.log);
      snapshot.getPromise(value).then(console.log);
    });
  });

  return null;
};

export default RecoilDevtools;
