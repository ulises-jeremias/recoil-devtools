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

  const updateState = (value: any, previousValue: any, nextValue: any) => {
    setState(({ prevState, nextState }) => ({
      prevState: {
        ...prevState,
        [value.key]: previousValue,
      },
      nextState: {
        ...nextState,
        [value.key]: nextValue,
      },
    }));
  };

  useRecoilTransactionObserver_UNSTABLE(
    async ({ previousSnapshot, snapshot }) => {
      if (values?.length) {
        values?.forEach(async (value) => {
          const previousValue = await previousSnapshot.getPromise(value);
          const nextValue = await snapshot.getPromise(value);

          updateState(value, previousValue, nextValue);
        });
        return;
      }

      for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
        const previousValue = await previousSnapshot.getPromise(node);
        const nextValue = await snapshot.getPromise(node);

        updateState(node, previousValue, nextValue);
      }
    }
  );

  useEffect(() => {
    const logEntry = { ...state, action: actionTransformer(state) };
    logger(() => null)(logEntry);
  }, [state]);

  return null;
};
