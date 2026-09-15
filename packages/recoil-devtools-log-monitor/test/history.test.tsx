import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  atom,
  type RecoilState,
  type RecoilValue,
  type Snapshot,
  type useRecoilTransactionObserver_UNSTABLE,
} from 'recoil';
import { useRecoilTransactionsHistory } from '../src/history';

type Observer = Parameters<typeof useRecoilTransactionObserver_UNSTABLE>[0];

const recoil = vi.hoisted(() => ({
  observe: vi.fn<(callback: Observer) => void>(),
  snapshot: vi.fn<() => Snapshot>(),
  gotoSnapshot: vi.fn<(snapshot: Snapshot) => void>(),
}));

vi.mock('recoil', async (importOriginal) => ({
  ...(await importOriginal<typeof import('recoil')>()),
  useRecoilSnapshot: recoil.snapshot,
  useGotoRecoilSnapshot: () => recoil.gotoSnapshot,
  useRecoilTransactionObserver_UNSTABLE: recoil.observe,
}));

const count = atom({ key: 'count', default: 0 });
const other = atom({ key: 'other', default: 10 });
const atoms = { count, other };
type AtomKey = keyof typeof atoms;

function snapshot(
  values: Partial<Record<AtomKey, number>> = {},
  modified = Object.keys(values) as AtomKey[]
): Snapshot {
  // Mock only the snapshot boundary consumed by the hook; React state and the
  // history handlers remain real. No RecoilRoot or live store is involved.
  return {
    getNodes_UNSTABLE: vi.fn(({ isModified } = {}) =>
      (isModified ? modified : (Object.keys(values) as AtomKey[])).map(
        (key) => atoms[key]
      )
    ),
    getPromise: vi.fn(async (node: RecoilValue<unknown>) => {
      const value = values[node.key as AtomKey];
      if (value === undefined) throw new Error(`Missing value: ${node.key}`);
      return value;
    }),
  } as unknown as Snapshot;
}

function mountHistory(initial = snapshot(), values?: RecoilState<number>[]) {
  recoil.snapshot.mockReturnValue(initial);
  return renderHook(() => useRecoilTransactionsHistory(values));
}

async function record(previousSnapshot: Snapshot, nextSnapshot: Snapshot) {
  const callback = recoil.observe.mock.lastCall?.[0];
  if (!callback) throw new Error('Transaction observer was not registered');
  await act(async () => {
    await callback({ previousSnapshot, snapshot: nextSnapshot });
  });
}

async function historyWithTransactions() {
  const initial = snapshot({ count: 0, other: 10 });
  const first = snapshot({ count: 1, other: 10 }, ['count']);
  const second = snapshot({ count: 2, other: 10 }, ['count']);
  const third = snapshot({ count: 3, other: 10 }, ['count']);
  const hook = mountHistory(initial);
  await waitFor(() => expect(hook.result.current.stagedActionIds).toEqual([0]));
  await record(initial, first);
  await record(first, second);
  await record(second, third);
  return { ...hook, initial, first, second, third };
}

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.restoreAllMocks());

describe('useRecoilTransactionsHistory', () => {
  it('starts with empty history when the snapshot contains no atoms', () => {
    const { result } = mountHistory();
    expect(result.current).toMatchObject({
      current: { previousState: {}, nextState: {} },
      computedStates: [],
      stagedActionIds: [],
      actionsById: {},
      currentStateIndex: -1,
      consecutiveToggleStartId: null,
      hasStates: false,
    });
    expect(Object.keys(result.current.skippedActionIds)).toEqual([]);
    act(() => result.current.handleReset());
    act(() => result.current.handleRollback());
    act(() => result.current.handleSweep());
    expect(result.current.stagedActionIds).toEqual([]);
    expect(recoil.gotoSnapshot).not.toHaveBeenCalled();
  });

  it('captures existing atoms once, before any transactions are observed', async () => {
    const { result, rerender } = mountHistory(
      snapshot({ count: 0, other: 10 })
    );
    await waitFor(() => expect(result.current.hasStates).toBe(true));
    expect(result.current.actionsById).toEqual({
      0: { type: 'Initial State', count: 0, other: 10 },
    });
    expect(result.current.computedStates).toEqual([
      {
        previousState: { count: 0, other: 10 },
        nextState: { count: 0, other: 10 },
      },
    ]);
    expect(result.current.stagedActionIds).toEqual([0]);
    expect(result.current.currentStateIndex).toBe(0);
    recoil.snapshot.mockReturnValue(snapshot({ count: 99 }));
    await act(async () => rerender());
    expect(result.current.actionsById[0]).toEqual({
      type: 'Initial State',
      count: 0,
      other: 10,
    });
  });

  it('records ordered transactions with only modified atoms by default', async () => {
    const { result } = await historyWithTransactions();
    expect(result.current.stagedActionIds).toEqual([0, 1, 2, 3]);
    expect(result.current.actionsById).toEqual({
      0: { type: 'Initial State', count: 0, other: 10 },
      1: { type: 'Transaction #2', count: 1 },
      2: { type: 'Transaction #3', count: 2 },
      3: { type: 'Transaction #4', count: 3 },
    });
    expect(result.current.computedStates.slice(1)).toEqual([
      { previousState: { count: 0 }, nextState: { count: 1 } },
      { previousState: { count: 1 }, nextState: { count: 2 } },
      { previousState: { count: 2 }, nextState: { count: 3 } },
    ]);
    expect(result.current.currentStateIndex).toBe(3);
    expect(recoil.gotoSnapshot).not.toHaveBeenCalled();
  });

  it('restricts initial capture and transactions to explicitly selected atoms', async () => {
    const initial = snapshot({ count: 0, other: 10 });
    const next = snapshot({ count: 1, other: 20 }, ['other']);
    const { result } = mountHistory(initial, [count]);
    await waitFor(() => expect(result.current.hasStates).toBe(true));
    await record(initial, next);
    expect(result.current.actionsById).toEqual({
      0: { type: 'Initial State', count: 0 },
      1: { type: 'Transaction #2', count: 1 },
    });
    expect(result.current.computedStates).toEqual([
      { previousState: { count: 0 }, nextState: { count: 0 } },
      { previousState: { count: 0 }, nextState: { count: 1 } },
    ]);
    expect(next.getNodes_UNSTABLE).not.toHaveBeenCalled();
    expect(next.getPromise).toHaveBeenCalledWith(count);
    expect(next.getPromise).not.toHaveBeenCalledWith(other);
  });

  it('waits for asynchronous selected values before publishing a transaction', async () => {
    const initial = snapshot({ count: 0, other: 10 });
    const next = snapshot({ count: 1, other: 20 });
    const { result } = mountHistory(initial, [count, other]);
    await waitFor(() => expect(result.current.stagedActionIds).toEqual([0]));
    let resolveValue!: (value: number) => void;
    const delayed = new Promise<number>((resolve) => {
      resolveValue = resolve;
    });
    vi.mocked(next.getPromise).mockReturnValueOnce(delayed);
    const callback = recoil.observe.mock.lastCall?.[0];
    if (!callback) throw new Error('Transaction observer was not registered');
    const pending = callback({ previousSnapshot: initial, snapshot: next });
    expect(result.current.stagedActionIds).toEqual([0]);
    await act(async () => {
      resolveValue(1);
      await pending;
    });
    expect(result.current.actionsById[1]).toEqual({
      type: 'Transaction #2',
      count: 1,
      other: 20,
    });
    expect(result.current.computedStates[1]).toEqual({
      previousState: { count: 0, other: 10 },
      nextState: { count: 1, other: 20 },
    });
  });

  it('skips and reenables actions without removing their history', async () => {
    const { result } = await historyWithTransactions();
    act(() => result.current.handleToggleAction(3));
    expect(result.current.skippedActionIds[3]).toBe(true);
    expect(result.current.currentStateIndex).toBe(2);
    expect(result.current.stagedActionIds).toEqual([0, 1, 2, 3]);
    expect(result.current.actionsById[3]).toEqual({
      type: 'Transaction #4',
      count: 3,
    });
    act(() => result.current.handleToggleAction(3));
    expect(result.current.skippedActionIds[3]).toBe(false);
    expect(result.current.currentStateIndex).toBe(3);
    for (const id of [0, 1, 2, 3])
      act(() => result.current.handleToggleAction(id));
    expect(result.current.currentStateIndex).toBe(-1);
    expect(recoil.gotoSnapshot).not.toHaveBeenCalled();
  });

  it.each([
    [1, 3],
    [3, 1],
  ])(
    'toggles the inclusive range between shift-clicks %i and %i',
    async (start, end) => {
      const { result } = await historyWithTransactions();
      act(() => result.current.handleToggleConsecutiveAction(start));
      expect(result.current.consecutiveToggleStartId).toBe(start);
      expect(Object.keys(result.current.skippedActionIds)).toEqual([]);
      act(() => result.current.handleToggleConsecutiveAction(end));
      expect(result.current.skippedActionIds).toEqual({
        1: true,
        2: true,
        3: true,
      });
      expect(result.current.consecutiveToggleStartId).toBeNull();
      expect(result.current.currentStateIndex).toBe(0);
      act(() => result.current.handleToggleConsecutiveAction(start));
      act(() => result.current.handleToggleConsecutiveAction(end));
      expect(result.current.skippedActionIds).toEqual({
        1: false,
        2: false,
        3: false,
      });
      expect(result.current.currentStateIndex).toBe(3);
    }
  );

  it('does not start a consecutive selection at the initial entry', async () => {
    const { result } = await historyWithTransactions();
    act(() => result.current.handleToggleConsecutiveAction(0));
    expect(result.current.consecutiveToggleStartId).toBeNull();
    expect(Object.keys(result.current.skippedActionIds)).toEqual([]);
  });

  it('commits a history boundary and rolls back through earlier boundaries', async () => {
    const { result, third } = await historyWithTransactions();
    act(() => result.current.handleCommit());
    expect(result.current.stagedActionIds).toEqual([]);
    expect(result.current.computedStates).toEqual([]);
    const fourth = snapshot({ count: 4 });
    await record(third, fourth);
    expect(result.current.stagedActionIds).toEqual([4]);
    expect(result.current.computedStates).toEqual([
      { previousState: { count: 3 }, nextState: { count: 4 } },
    ]);
    act(() => result.current.handleCommit());
    expect(result.current.stagedActionIds).toEqual([]);
    act(() => result.current.handleRollback());
    expect(result.current.stagedActionIds).toEqual([4]);
    act(() => result.current.handleRollback());
    expect(result.current.stagedActionIds).toEqual([0, 1, 2, 3, 4]);
    expect(result.current.computedStates).toHaveLength(5);
    act(() => result.current.handleRollback());
    expect(result.current.stagedActionIds).toEqual([0, 1, 2, 3, 4]);
    expect(recoil.gotoSnapshot).not.toHaveBeenCalled();
  });

  it('sweeps only skipped entries and keeps actions, states and snapshots aligned', async () => {
    const { result, initial, second, third } = await historyWithTransactions();
    const before = result.current;
    act(() => result.current.handleSweep());
    expect(result.current).toBe(before);
    act(() => result.current.handleToggleAction(1));
    act(() => result.current.handleToggleAction(3));
    act(() => result.current.handleSweep());
    expect(result.current.stagedActionIds).toEqual([0, 1]);
    expect(result.current.actionsById).toEqual({
      0: { type: 'Initial State', count: 0, other: 10 },
      1: { type: 'Transaction #3', count: 2 },
    });
    expect(result.current.computedStates).toEqual([
      {
        previousState: { count: 0, other: 10 },
        nextState: { count: 0, other: 10 },
      },
      { previousState: { count: 1 }, nextState: { count: 2 } },
    ]);
    expect(Object.keys(result.current.skippedActionIds)).toEqual([]);
    expect(result.current.currentStateIndex).toBe(1);
    act(() => result.current.handleToggleAction(0));
    act(() => result.current.handleSweep());
    act(() => result.current.handleReset());
    expect(recoil.gotoSnapshot).toHaveBeenCalledExactlyOnceWith(second);
    expect(recoil.gotoSnapshot).not.toHaveBeenCalledWith(initial);
    expect(recoil.gotoSnapshot).not.toHaveBeenCalledWith(third);
  });

  it('clears the timeline when every entry is skipped and swept', async () => {
    const { result } = await historyWithTransactions();
    for (const id of [0, 1, 2, 3])
      act(() => result.current.handleToggleAction(id));
    act(() => result.current.handleSweep());
    expect(result.current.stagedActionIds).toEqual([]);
    expect(result.current.computedStates).toEqual([]);
    expect(result.current.actionsById).toEqual({});
    expect(result.current.hasStates).toBe(false);
    expect(result.current.currentStateIndex).toBe(-1);
    act(() => result.current.handleReset());
    expect(recoil.gotoSnapshot).not.toHaveBeenCalled();
  });

  it('resets to the initial snapshot and starts a fresh timeline', async () => {
    const { result, initial } = await historyWithTransactions();
    act(() => result.current.handleToggleAction(1));
    act(() => result.current.handleReset());
    expect(recoil.gotoSnapshot).toHaveBeenCalledExactlyOnceWith(initial);
    expect(result.current.actionsById).toEqual({});
    expect(result.current.stagedActionIds).toEqual([]);
    expect(result.current.computedStates).toEqual([]);
    expect(Object.keys(result.current.skippedActionIds)).toEqual([]);
    expect(result.current.hasStates).toBe(false);
    await record(initial, snapshot({ count: 5 }));
    expect(result.current.stagedActionIds).toEqual([0]);
    expect(result.current.actionsById).toEqual({
      0: { type: 'Transaction #1', count: 5 },
    });
  });

  it('resets to the first snapshot after a commit, once one is recorded', async () => {
    const { result, third } = await historyWithTransactions();
    act(() => result.current.handleCommit());
    act(() => result.current.handleReset());
    expect(recoil.gotoSnapshot).not.toHaveBeenCalled();
    const fourth = snapshot({ count: 4 });
    await record(third, fourth);
    act(() => result.current.handleReset());
    expect(recoil.gotoSnapshot).toHaveBeenCalledExactlyOnceWith(fourth);
    expect(result.current.stagedActionIds).toEqual([]);
  });
});
