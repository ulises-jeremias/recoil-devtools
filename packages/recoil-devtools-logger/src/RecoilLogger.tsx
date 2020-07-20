import { FC, useState, useEffect } from 'react';
import { RecoilState, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import defaultLogger from './logger';

export type Logger = (
  next: Function
) => ({ prevState, nextState }: { prevState: any; nextState: any }) => any;

export interface RecoilLoggerProps {
  values?: RecoilState<any>[];
  logger?: Logger;
  next?: Function;
  actionTransformer?: Function;
}

export const RecoilLogger: FC<RecoilLoggerProps> = ({
  values,
  logger = defaultLogger,
  actionTransformer = () => ({ description: 'state update' }),
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
    const logEntry = { ...state, action: actionTransformer(state) };
    logger(() => null)(logEntry);
  }, [state]);

  return null;
};
