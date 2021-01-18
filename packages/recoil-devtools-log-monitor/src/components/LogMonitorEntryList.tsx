import React, { FC } from 'react';
import { Base16Theme } from 'base16';
import LogMonitorEntry from './LogMonitorEntry';

interface Props {
  actionsById: { [actionId: number]: any };
  computedStates: { previousState: any; nextState: any; error?: string }[];
  stagedActionIds: number[];
  skippedActionIds: Record<number, boolean>;
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
}) => (
  <>
    {stagedActionIds.map((stagedActionId, i) => {
      const actionId = stagedActionId;
      const action = actionsById[actionId];
      const { previousState, nextState: state, error } = computedStates[i];

      return (
        <LogMonitorEntry
          key={actionId}
          theme={theme}
          select={select}
          action={action}
          actionId={actionId}
          state={state}
          previousState={previousState}
          collapsed={!!skippedActionIds[actionId]}
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
    })}
  </>
);

export default LogMonitorEntryList;
