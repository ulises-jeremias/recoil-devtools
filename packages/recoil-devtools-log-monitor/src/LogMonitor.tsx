import React, { FC, useState } from 'react';
import { RecoilState, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import * as themes from 'recoil-devtools-themes';
import { Base16Theme } from 'base16';
import LogMonitorButtonBar from './LogMonitorButtonBar';
import LogMonitorEntryList from './LogMonitorEntryList';

const styles: {
  container: React.CSSProperties;
  elements: React.CSSProperties;
} = {
  container: {
    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
    position: 'relative',
    overflowY: 'hidden',
    width: '100%',
    height: '100%',
    minWidth: 300,
    direction: 'ltr',
  },
  elements: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
};

export interface LogMonitorProps {
  values?: RecoilState<any>[];
  select?: (state: any) => unknown;
  theme?: keyof typeof themes | Base16Theme;
  expandActionRoot?: boolean;
  expandStateRoot?: boolean;
  markStateDiff?: boolean;
  hideMainButtons?: boolean;
}

const LogMonitor: FC<LogMonitorProps> = ({
  values,
  select = (state: unknown) => state,
  theme = 'ulisesjcf',
  expandActionRoot = true,
  expandStateRoot = true,
  markStateDiff = false,
  hideMainButtons = false,
}) => {
  const [computedStates, setComputedStates] = useState<any[]>([]);
  const [stagedActionIds, setStagedActionIds] = useState<number[]>([]);
  const [actionsById, setActionsById] = useState<Object>({});
  const [state, setState] = useState({});

  const getTheme = () => {
    if (typeof theme !== 'string') {
      return theme;
    }

    if (typeof themes[theme] !== 'undefined') {
      return themes[theme];
    }

    console.warn(
      'DevTools theme ' + theme + ' not found, defaulting to ulisesjcf'
    );
    return themes.ulisesjcf;
  };

  const getPayload = (
    { prevState, nextState }: { prevState: any; nextState: any },
    value: any,
    previousValue: any,
    nextValue: any
  ) => ({
    prevState: {
      ...prevState,
      [value.key]: previousValue,
    },
    nextState: {
      ...nextState,
      [value.key]: nextValue,
    },
  });

  const updateState = (value: any, nextValue: any) => {
    setState((prevState) => ({
      ...prevState,
      [value.key]: nextValue,
    }));
  };

  useRecoilTransactionObserver_UNSTABLE(
    async ({ previousSnapshot, snapshot }) => {
      let payload = { prevState: {}, nextState: {} };
      const snapshotId = Number(snapshot.getID());

      if (values?.length) {
        values?.forEach(async (value) => {
          const nextValue = await snapshot.getPromise(value);
          const previousValue = await previousSnapshot.getPromise(value);

          updateState(value, nextValue);
          payload = getPayload(payload, value, previousValue, nextValue);
        });
      } else {
        for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
          const nextValue = await snapshot.getPromise(node);
          const previousValue = await previousSnapshot.getPromise(node);

          updateState(node, nextValue);
          payload = getPayload(payload, node, previousValue, nextValue);
        }
      }

      setActionsById({
        ...actionsById,
        [snapshotId]: {
          type: 'Update',
          ...payload,
        },
      });
      setStagedActionIds([...stagedActionIds, snapshotId]);
      setComputedStates([...computedStates, { state: { ...state } }]);
    }
  );

  const logMonitorTheme = getTheme();

  const entryListProps = {
    theme: logMonitorTheme,
    select,
    expandActionRoot,
    expandStateRoot,
    markStateDiff,
    actionsById,
    computedStates,
    stagedActionIds,
    skippedActionIds: [],
    currentStateIndex: 0,
    consecutiveToggleStartId: 0,
    onActionClick: () => {},
    onActionShiftClick: () => {},
  };

  return (
    <div
      style={{ ...styles.container, backgroundColor: logMonitorTheme.base00 }}
    >
      {!hideMainButtons && (
        <LogMonitorButtonBar
          theme={logMonitorTheme}
          hasStates={computedStates.length > 0}
          hasSkippedActions={false}
        />
      )}
      <div
        style={
          hideMainButtons ? styles.elements : { ...styles.elements, top: 30 }
        }
      >
        <LogMonitorEntryList {...entryListProps} />
      </div>
    </div>
  );
};

export default LogMonitor;
