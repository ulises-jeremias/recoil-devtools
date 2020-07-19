import { FC, useState, useEffect } from 'react';
import { RecoilState, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import defaultLogger from './logger';

export type Logger = (
  next: Function
) => ({ prevState, nextState }: { prevState: any; nextState: any }) => any;

export interface RecoilDevtoolsProps {
  values?: RecoilState<any>[];
  logger?: Logger;
  next?: Function;
  actionTransformer?: Function;
}

export const RecoilDevtools: FC<RecoilDevtoolsProps> = ({
  values,
  next = () => null,
  logger = defaultLogger,
  actionTransformer = () => 'state update',
}) => {
  const [state, setState] = useState({ prevState: {}, nextState: {} });

  useRecoilTransactionObserver_UNSTABLE(async ({ previousSnapshot, snapshot }) => {
    values?.forEach(async (value) => {
      const previousValue = await previousSnapshot.getPromise(value);
      const nextValue = await snapshot.getPromise(value);

      setState(({ prevState, nextState }) => ({
        prevState: {
          ...prevState,
          [value.key]: previousValue,
        },
        nextState: {
          ...nextState,
          [value.key]: nextValue,
        }
      }));
    });
  });

  useEffect(() => {
    logger(next)({ ...state, action: actionTransformer(state) });
  }, [state]);

  return null;
};
