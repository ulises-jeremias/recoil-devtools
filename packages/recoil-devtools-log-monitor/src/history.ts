import { useState } from 'react';
import {
  RecoilState,
  Snapshot,
  useGotoRecoilSnapshot,
  useRecoilTransactionObserver_UNSTABLE,
} from 'recoil';
import { findLastIndex } from './helpers';

export interface StateTransaction {
  previousState: any;
  nextState: any;
}

export interface State {
  currentInitialIdx: number;
  commitedIdxs: number[];
  current: StateTransaction;
  computedStates: StateTransaction[];
  stagedActionIds: number[];
  skippedActionIds: Record<number, boolean>;
  snapshotsById: Record<number, Snapshot>;
  actionsById: Record<number, any>;
}

const initialStateValue: State = {
  currentInitialIdx: 0,
  commitedIdxs: [],
  current: { previousState: {}, nextState: {} },
  computedStates: [],
  stagedActionIds: [],
  skippedActionIds: [],
  snapshotsById: {},
  actionsById: {},
};

export const useRecoilTransactionsHistory = (values?: RecoilState<any>[]) => {
  const [state, setState] = useState<State>(initialStateValue);
  const [consecutiveToggleStartId, setConsecutiveToggleStartId] = useState<
    number
  >(0);

  const gotoSnapshot = useGotoRecoilSnapshot();

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
    const { previousState, nextState } = currentState;

    return {
      previousState: {
        ...previousState,
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
      let currentState: StateTransaction = state.current;

      if (values?.length) {
        values?.forEach(async (value) => {
          const nextValue = await snapshot.getPromise(value);
          const previousValue = await previousSnapshot.getPromise(value);

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
          const nextValue = await snapshot.getPromise(node);
          const previousValue = await previousSnapshot.getPromise(node);

          payload = getPayload(payload, node, previousValue, nextValue);
          currentState = getNextState(
            currentState,
            node,
            previousValue,
            nextValue
          );
        }
      }

      const {
        actionsById,
        computedStates,
        stagedActionIds,
        snapshotsById,
      } = state;
      const actionId = stagedActionIds.length;
      const nextActionsById = {
        ...actionsById,
        [actionId]: {
          type: `Transaction #${actionId + 1}`,
          ...payload,
        },
      };
      const nextSnapshotsById = {
        ...snapshotsById,
        [actionId]: snapshot,
      };
      const nextComputedStates: StateTransaction[] = [
        ...computedStates,
        { ...currentState },
      ];
      const nextStagedActionIds = [...stagedActionIds, actionId];
      setState({
        ...state,
        actionsById: nextActionsById,
        computedStates: nextComputedStates,
        stagedActionIds: nextStagedActionIds,
        snapshotsById: nextSnapshotsById,
      });
    }
  );

  const handleRollback = () => {
    const { commitedIdxs } = state;
    const nextCommitedIdx = commitedIdxs.slice(-1).pop() || 0;

    setState({
      ...state,
      currentInitialIdx: nextCommitedIdx,
      commitedIdxs: commitedIdxs.slice(0, commitedIdxs.length - 1),
    });
  };

  const handleCommit = () => {
    const { commitedIdxs, currentInitialIdx, stagedActionIds } = state;

    setState({
      ...state,
      currentInitialIdx: stagedActionIds.length,
      commitedIdxs: [...commitedIdxs, currentInitialIdx],
    });
  };

  const handleReset = () => {
    const { currentInitialIdx, snapshotsById, stagedActionIds } = state;
    const actionId = stagedActionIds[currentInitialIdx];
    const initialSnapshot = snapshotsById[actionId];
    gotoSnapshot(initialSnapshot);
    setState(initialStateValue);
  };

  const handleSweep = () => {
    console.warn('Log Monitor: Sweep is not implemented yet');
  };

  const handleToggleAction = (id: number) => {
    setState({
      ...state,
      skippedActionIds: {
        ...state.skippedActionIds,
        [id]: !state.skippedActionIds[id],
      },
    });
  };

  const setActionsActive = (start: number, end: number, active: boolean) => {
    let nextSkippedActionIds = state.skippedActionIds;
    for (let i = start; i < end; i++) {
      nextSkippedActionIds[i] = active;
    }
    setState({
      ...state,
      skippedActionIds: nextSkippedActionIds,
    });
  };

  const handleToggleConsecutiveAction = (id: number) => {
    const { actionsById } = state;
    if (consecutiveToggleStartId && actionsById[consecutiveToggleStartId]) {
      const { skippedActionIds } = state;
      const start = Math.min(consecutiveToggleStartId, id);
      const end = Math.max(consecutiveToggleStartId, id);
      const active = !skippedActionIds[consecutiveToggleStartId];
      setActionsActive(start, end + 1, active);
      setConsecutiveToggleStartId(0);
    } else if (id > 0) {
      setConsecutiveToggleStartId(id);
    }
  };

  const currentStateIndex = findLastIndex(
    state.stagedActionIds,
    (actionId) => !state.skippedActionIds[actionId]
  );

  return {
    current: state.current,
    computedStates: state.computedStates.slice(state.currentInitialIdx),
    stagedActionIds: state.stagedActionIds.slice(state.currentInitialIdx),
    skippedActionIds: state.skippedActionIds,
    actionsById: state.actionsById,
    currentStateIndex,
    consecutiveToggleStartId,
    handleRollback,
    handleSweep,
    handleCommit,
    handleReset,
    handleToggleAction,
    handleToggleConsecutiveAction,
  };
};
