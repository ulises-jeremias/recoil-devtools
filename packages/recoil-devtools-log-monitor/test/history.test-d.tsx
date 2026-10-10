import { expectTypeOf } from 'vitest';
import { atom } from 'recoil';
import { LogMonitor } from '../src';
import {
  useRecoilTransactionsHistory,
  type StateTransaction,
  type TransactionAction,
} from '../src/history';

const count = atom({ key: 'typed-count', default: 0 });
const text = atom({ key: 'typed-text', default: '' });
const details = atom({ key: 'typed-details', default: { enabled: true } });

// Existing callers may track heterogeneous atoms and select a narrower shape.
<LogMonitor values={[count]} />;
<LogMonitor values={[count, text, details]} />;
<LogMonitor select={(state: { count: number }) => state.count} />;
function useSelectedHistory() {
  return useRecoilTransactionsHistory([count, text, details]);
}
expectTypeOf(useSelectedHistory).returns.toEqualTypeOf<
  ReturnType<typeof useRecoilTransactionsHistory>
>();

declare const transaction: StateTransaction;
declare const history: ReturnType<typeof useRecoilTransactionsHistory>;
expectTypeOf(transaction.nextState['count']).toEqualTypeOf<unknown>();
expectTypeOf(transaction.previousState['details']).toEqualTypeOf<unknown>();
expectTypeOf(history.actionsById[0]).toEqualTypeOf<
  TransactionAction | undefined
>();

// Values from arbitrary atom keys must be narrowed before use.
// @ts-expect-error An atom value is not necessarily a number.
transaction.nextState['count'].toFixed();
// @ts-expect-error A sparse timeline may not contain an action at this index.
void history.actionsById[999].type;

declare const action: TransactionAction;
expectTypeOf(action.type).toEqualTypeOf<unknown>();
expectTypeOf(action['details']).toEqualTypeOf<unknown>();
