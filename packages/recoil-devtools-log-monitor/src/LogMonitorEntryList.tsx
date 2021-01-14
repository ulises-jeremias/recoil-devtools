import React, { FC } from 'react';
import { Base16Theme } from 'base16';
import LogMonitorEntry from './LogMonitorEntry';

interface Props {
  actionsById: { [actionId: number]: any };
  computedStates: { state: any; error?: string }[];
  stagedActionIds: number[];
  skippedActionIds: number[];
  currentStateIndex: number;
  consecutiveToggleStartId: number | null | undefined;

  select: (state: any) => unknown;
  onActionClick: (id: number) => void;
  theme: Base16Theme;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
  onActionShiftClick: (id: number) => void;
}

const LogMonitorEntryList: FC<Props> = ({
  actionsById,
  computedStates,
  stagedActionIds,
  skippedActionIds,
  currentStateIndex,
  consecutiveToggleStartId,
  select,
  onActionClick,
  theme,
  expandActionRoot,
  expandStateRoot,
  markStateDiff,
  onActionShiftClick,
}) => {
  const elements = [];

  for (let i = 0; i < stagedActionIds.length; i++) {
    const actionId = stagedActionIds[i];
    const action = actionsById[actionId].action;
    const { state, error } = computedStates[i];
    let previousState;
    if (i > 0) {
      previousState = computedStates[i - 1].state;
    }
    elements.push(
      <LogMonitorEntry
        key={actionId}
        theme={theme}
        select={select}
        action={action}
        actionId={actionId}
        state={state}
        previousState={previousState}
        collapsed={skippedActionIds.indexOf(actionId) > -1}
        inFuture={i > currentStateIndex}
        selected={consecutiveToggleStartId === i}
        error={error}
        expandActionRoot={expandActionRoot}
        expandStateRoot={expandStateRoot}
        markStateDiff={markStateDiff}
        onActionClick={onActionClick}
        onActionShiftClick={onActionShiftClick}
      />
    );
  }

  return <div>{elements}</div>;
};

export default LogMonitorEntryList;
