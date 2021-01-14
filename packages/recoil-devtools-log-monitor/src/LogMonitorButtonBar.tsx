import React, { CSSProperties, FC } from 'react';
import { Base16Theme } from 'base16';
import LogMonitorButton from './LogMonitorButton';

const style: CSSProperties = {
  textAlign: 'center',
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderColor: 'transparent',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'row',
};

interface Props {
  theme: Base16Theme;
  hasStates: boolean;
  hasSkippedActions: boolean;
}

const LogMonitorButtonBar: FC<Props> = ({
  theme,
  hasStates,
  hasSkippedActions,
}) => {
  const handleRollback = () => {};

  const handleSweep = () => {};

  const handleCommit = () => {};

  const handleReset = () => {};

  return (
    <div style={{ ...style, borderColor: theme.base02 }}>
      <LogMonitorButton theme={theme} onClick={handleReset} enabled>
        Reset
      </LogMonitorButton>
      <LogMonitorButton
        theme={theme}
        onClick={handleRollback}
        enabled={hasStates}
      >
        Revert
      </LogMonitorButton>
      <LogMonitorButton
        theme={theme}
        onClick={handleSweep}
        enabled={hasSkippedActions}
      >
        Sweep
      </LogMonitorButton>
      <LogMonitorButton
        theme={theme}
        onClick={handleCommit}
        enabled={hasStates}
      >
        Commit
      </LogMonitorButton>
    </div>
  );
};

export default LogMonitorButtonBar;
