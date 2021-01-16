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
  onRollbackClick?: () => void;
  onSweepClick?: () => void;
  onCommitClick?: () => void;
  onResetClick?: () => void;
}

const LogMonitorButtonBar: FC<Props> = ({
  theme,
  hasStates,
  hasSkippedActions,
  onRollbackClick,
  onSweepClick,
  onCommitClick,
  onResetClick,
}) => (
  <div style={{ ...style, borderColor: theme.base02 }}>
    <LogMonitorButton theme={theme} onClick={onResetClick} enabled>
      Reset
    </LogMonitorButton>
    <LogMonitorButton
      theme={theme}
      onClick={onRollbackClick}
      enabled={hasStates}
    >
      Revert
    </LogMonitorButton>
    <LogMonitorButton
      theme={theme}
      onClick={onSweepClick}
      enabled={hasSkippedActions}
    >
      Sweep
    </LogMonitorButton>
    <LogMonitorButton theme={theme} onClick={onCommitClick} enabled={hasStates}>
      Commit
    </LogMonitorButton>
  </div>
);

export default LogMonitorButtonBar;
