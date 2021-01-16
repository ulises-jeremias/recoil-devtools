import React, { CSSProperties, FC, MouseEventHandler } from 'react';
import JSONTree from 'react-json-tree';
import { Base16Theme } from 'base16';

const styles = {
  actionBar: {
    paddingTop: 8,
    paddingBottom: 7,
    paddingLeft: 16,
  },
  payload: {
    margin: 0,
    paddingLeft: 16,
    overflow: 'auto',
  },
};

interface Props {
  theme: Base16Theme;
  collapsed: boolean;
  action: any;
  expandActionRoot: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  style: CSSProperties;
}

const LogMonitorAction: FC<Props> = ({
  theme,
  collapsed,
  action,
  expandActionRoot,
  onClick,
  style,
}) => {
  const shouldExpandNode = (_: (string | number)[], __: any, level: number) => {
    return expandActionRoot && level === 0;
  };

  const renderPayload = (payload: Record<string, unknown>) => (
    <div
      style={{
        ...styles.payload,
        backgroundColor: theme.base00,
      }}
    >
      {Object.keys(payload).length > 0 ? (
        <JSONTree
          theme={theme}
          invertTheme={false}
          keyPath={['action']}
          data={payload}
          shouldExpandNode={shouldExpandNode}
        />
      ) : (
        ''
      )}
    </div>
  );

  const { type, ...payload } = action;

  return (
    <div
      style={{
        backgroundColor: theme.base02,
        color: theme.base06,
        ...style,
      }}
    >
      <div style={styles.actionBar} onClick={onClick}>
        {type !== null && (type as string).toString()}
      </div>
      {!collapsed ? renderPayload(payload) : ''}
    </div>
  );
};

export default LogMonitorAction;
