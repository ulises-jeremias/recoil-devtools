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
  markStateDiff,
  hideMainButtons,
}) => {
  const [computedStates, setComputedStates] = useState<any[]>([]);

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

  const getNextState = (nextState: Object, value: any, nextValue: any) => ({
    nextState: {
      ...nextState,
      [value.key]: nextValue,
    },
  });

  useRecoilTransactionObserver_UNSTABLE(async ({ snapshot }) => {
    let nextState = {};

    if (values?.length) {
      values?.forEach(async value => {
        const nextValue = await snapshot.getPromise(value);

        nextState = getNextState(nextState, value, nextValue);
      });
    } else {
      for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
        const nextValue = await snapshot.getPromise(node);

        nextState = getNextState(nextState, node, nextValue);
      }
    }

    setComputedStates([...computedStates, nextState]);
  });

  const logMonitorTheme = getTheme();

  const entryListProps = {
    theme: logMonitorTheme,
    select,
    expandActionRoot,
    expandStateRoot,
    markStateDiff,
    actionsById: [],
    computedStates,
    stagedActionIds: [],
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
