import React, { CSSProperties, FC, MouseEventHandler } from 'react';
import JSONTree, { StylingValue } from 'react-json-tree';
import { Base16Theme } from 'base16';
import LogMonitorEntryAction from './LogMonitorEntryAction';

const styles: { entry: CSSProperties; root: CSSProperties } = {
  entry: {
    display: 'block',
    WebkitUserSelect: 'none',
  },

  root: {
    marginLeft: 0,
  },
};

const getDeepItem = (data: any, path: (string | number)[]) =>
  path.reduce((obj, key) => obj && obj[key], data);
const dataIsEqual = (
  data: any,
  previousData: unknown,
  keyPath: (string | number)[]
) => {
  const path = [...keyPath].reverse().slice(1);

  return getDeepItem(data, path) === getDeepItem(previousData, path);
};

interface Props {
  theme: Base16Theme;
  select: (state: any) => unknown;
  action: any;
  actionId: number;
  state: any;
  previousState: any;
  collapsed: boolean;
  inFuture: boolean;
  selected: boolean;
  error: string | undefined;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
  onActionClick: (id: number) => void;
  onActionShiftClick: (id: number) => void;
}

export const LogMonitorEntry: FC<Props> = ({
  theme,
  select,
  action,
  actionId,
  state,
  previousState,
  collapsed,
  inFuture,
  selected,
  error,
  expandActionRoot,
  expandStateRoot,
  markStateDiff,
  onActionClick,
  onActionShiftClick,
}) => {
  const printState = (state: any, error: string | undefined) => {
    let errorText = error;
    if (!errorText) {
      try {
        const data = select(state);
        let nextTheme;

        if (markStateDiff) {
          const previousData =
            typeof previousState !== 'undefined'
              ? select(previousState)
              : undefined;
          const getValueStyle: StylingValue = ({ style }, _, keyPath) => ({
            style: {
              ...style,
              backgroundColor: dataIsEqual(data, previousData, keyPath)
                ? 'transparent'
                : theme.base01,
            },
          });
          const getNestedNodeStyle: StylingValue = ({ style }, keyPath) => ({
            style: {
              ...style,
              ...(keyPath.length > 1 ? {} : styles.root),
            },
          });
          nextTheme = {
            extend: theme,
            value: getValueStyle,
            nestedNode: getNestedNodeStyle,
          };
        } else {
          nextTheme = theme;
        }

        return (
          <JSONTree
            theme={nextTheme}
            data={data}
            invertTheme={false}
            keyPath={['state']}
            shouldExpandNode={shouldExpandNode}
          />
        );
      } catch (err) {
        errorText = 'Error selecting state.';
      }
    }

    return (
      <div
        style={{
          color: theme.base08,
          paddingTop: 20,
          paddingLeft: 30,
          paddingRight: 30,
          paddingBottom: 35,
        }}
      >
        {errorText}
      </div>
    );
  };

  const handleActionClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (actionId > 0) {
      if (e.shiftKey) {
        onActionShiftClick(actionId);
      } else {
        onActionClick(actionId);
      }
    }
  };

  const shouldExpandNode = (_: (string | number)[], __: any, level: number) => {
    return expandStateRoot && level === 0;
  };

  const styleEntry = {
    opacity: collapsed ? 0.5 : 1,
    cursor: actionId > 0 ? 'pointer' : 'default',
  };

  return (
    <div
      style={{
        opacity: selected ? 0.4 : inFuture ? 0.6 : 1, // eslint-disable-line no-nested-ternary
        textDecoration: collapsed ? 'line-through' : 'none',
        color: theme.base06,
      }}
    >
      <LogMonitorEntryAction
        theme={theme}
        collapsed={collapsed}
        action={action}
        expandActionRoot={expandActionRoot}
        onClick={handleActionClick}
        style={{ ...styles.entry, ...styleEntry }}
      />
      {!collapsed && (
        <div style={{ paddingLeft: 16 }}>{printState(state, error)}</div>
      )}
    </div>
  );
};

export default LogMonitorEntry;
