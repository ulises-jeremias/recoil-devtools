import React, { FC } from 'react';
import { RecoilState } from 'recoil';
import * as themes from 'recoil-devtools-themes';
import { Base16Theme } from 'base16';
import LogMonitorButtonBar from './LogMonitorButtonBar';
import LogMonitorEntryList from './LogMonitorEntryList';
import { useRecoilTransactionsHistory } from '../history';

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

  const logMonitorTheme = getTheme();

  const {
    actionsById,
    computedStates,
    commitedIdxs,
    stagedActionIds,
    skippedActionIds,
    currentStateIndex,
    consecutiveToggleStartId,
    handleRollback,
    handleSweep,
    handleCommit,
    handleReset,
    handleToggleAction,
    handleToggleConsecutiveAction,
  } = useRecoilTransactionsHistory(values);

  const entryListProps = {
    theme: logMonitorTheme,
    select,
    expandActionRoot,
    expandStateRoot,
    markStateDiff,
    actionsById,
    computedStates,
    stagedActionIds,
    skippedActionIds,
    currentStateIndex,
    consecutiveToggleStartId,
    onActionClick: handleToggleAction,
    onActionShiftClick: handleToggleConsecutiveAction,
  };

  return (
    <div
      style={{ ...styles.container, backgroundColor: logMonitorTheme.base00 }}
    >
      {!hideMainButtons && (
        <LogMonitorButtonBar
          theme={logMonitorTheme}
          onRollbackClick={handleRollback}
          onSweepClick={handleSweep}
          onCommitClick={handleCommit}
          onResetClick={handleReset}
          hasStates={commitedIdxs.length > 0}
          hasSkippedActions={Object.values(skippedActionIds).includes(true)}
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
