import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ulisesjcf } from 'recoil-devtools-themes';
import LogMonitorEntry from '../src/components/LogMonitorEntry';
import LogMonitorEntryAction from '../src/components/LogMonitorEntryAction';
import LogMonitorEntryList from '../src/components/LogMonitorEntryList';
import type { AtomValues } from '../src/history';

const previousState: AtomValues = {
  count: 1,
  text: 'unchanged',
  details: null,
};
const state: AtomValues = {
  count: 2,
  text: 'unchanged',
  details: { enabled: true },
};
const entryProps = {
  theme: ulisesjcf,
  action: { type: 'Transaction #2', ...state },
  actionId: 1,
  state,
  previousState,
  collapsed: false,
  inFuture: false,
  selected: false,
  error: undefined,
  expandActionRoot: true,
  expandStateRoot: true,
  markStateDiff: true,
  onActionClick: vi.fn(),
  onActionShiftClick: vi.fn(),
};

describe('log monitor entries', () => {
  it.each([
    [42, '42'],
    [null, ''],
    [undefined, ''],
    [
      {
        toString: () => 'custom label',
        [Symbol.toPrimitive]: () => 'coerced label',
      },
      'custom label',
    ],
  ])('renders an atom value in the action type field: %s', (type, label) => {
    const { container } = render(
      <LogMonitorEntryAction
        theme={ulisesjcf}
        action={{ type }}
        collapsed={false}
        expandActionRoot
        onClick={vi.fn()}
        style={{}}
      />
    );
    expect(container.textContent).toBe(label);
  });

  it('renders heterogeneous values and selects both sides of a state diff', () => {
    const select = vi.fn((values: AtomValues) => values);
    render(<LogMonitorEntry {...entryProps} select={select} />);

    expect(screen.getByText('Transaction #2')).toBeTruthy();
    expect(screen.getAllByText('"unchanged"')).toHaveLength(2);
    expect(select).toHaveBeenCalledWith(state);
    expect(select).toHaveBeenCalledWith(previousState);
    fireEvent.click(screen.getByText('Transaction #2'));
    expect(entryProps.onActionClick).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByText('Transaction #2'), { shiftKey: true });
    expect(entryProps.onActionShiftClick).toHaveBeenCalledWith(1);
  });

  it('shows selection failures without losing the action header', () => {
    render(
      <LogMonitorEntry
        {...entryProps}
        select={() => {
          throw new Error('invalid state slice');
        }}
      />
    );
    expect(
      screen.getByText('Error selecting state: invalid state slice')
    ).toBeTruthy();
    expect(screen.getByText('Transaction #2')).toBeTruthy();
  });

  it('skips a staged entry whose action is missing', () => {
    const { container } = render(
      <LogMonitorEntryList
        theme={ulisesjcf}
        actionsById={{}}
        computedStates={[{ previousState, nextState: state }]}
        stagedActionIds={[5]}
        skippedActionIds={{}}
        currentStateIndex={0}
        consecutiveToggleStartId={null}
        select={(values) => values}
        onActionClick={vi.fn()}
        onActionShiftClick={vi.fn()}
        expandActionRoot
        expandStateRoot
        markStateDiff
      />
    );
    expect(container.innerHTML).toBe('');
  });
});
