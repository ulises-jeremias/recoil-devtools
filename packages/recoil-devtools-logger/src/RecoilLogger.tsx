import { FC, useState } from 'react';
import { RecoilState, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import defaultLogger from './logger';

export type Logger = (
  next: Function
) => ({ prevState, nextState }: { prevState: any; nextState: any }) => any;

export interface StateTransaction {
  prevState: any;
  nextState: any;
}

export interface RecoilLoggerProps {
  values?: RecoilState<any>[];
  logger?: Logger;
  next?: Function;
  actionTransformer?: (action: any) => any;
}

export const RecoilLogger: FC<RecoilLoggerProps> = ({
  values,
  logger = defaultLogger,
  actionTransformer = (action) => ({ ...action }),
}) => {
  const [state, setState] = useState({ prevState: {}, nextState: {} });

  const getPayload = (payload: any, value: any, _: any, nextValue: any) => ({
    ...payload,
    [value.key]: nextValue,
  });

  const getNextState = (
    currentState: StateTransaction,
    value: any,
    previousValue: any,
    nextValue: any
  ) => {
    const { prevState, nextState } = currentState;

    return {
      prevState: {
        ...prevState,
        [value.key]: previousValue,
      },
      nextState: {
        ...nextState,
        [value.key]: nextValue,
      },
    };
  };

  useRecoilTransactionObserver_UNSTABLE(
    async ({ previousSnapshot, snapshot }) => {
      let payload = {};
      let updatedKeys = [];
      let currentState: StateTransaction = state;

      if (values?.length) {
        values?.forEach(async (value) => {
          const previousValue = await previousSnapshot.getPromise(value);
          const nextValue = await snapshot.getPromise(value);

          updatedKeys.push(value.key);
          payload = getPayload(payload, value, previousValue, nextValue);
          currentState = getNextState(
            currentState,
            value,
            previousValue,
            nextValue
          );
        });
      } else {
        // @ts-ignore
        for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
          const previousValue = await previousSnapshot.getPromise(node);
          const nextValue = await snapshot.getPromise(node);

          updatedKeys.push(node.key);
          payload = getPayload(payload, node, previousValue, nextValue);
          currentState = getNextState(
            currentState,
            node,
            previousValue,
            nextValue
          );
        }
      }

      const action = {
        description: `Updated keys: ${String(updatedKeys)}`,
        ...payload,
      };
      const logEntry = { ...currentState, action: actionTransformer(action) };
      logger(() => null)(logEntry);
      setState(currentState);
    }
  );

  return null;
};
