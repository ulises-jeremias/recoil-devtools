import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { RecoilRoot, atom, useSetRecoilState } from 'recoil';
import { RecoilLogger } from '../src';

const trackedAtom = atom({
  key: 'logger-test-atom',
  default: 'initial',
});

describe('ensure it renders', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <RecoilRoot>
        <RecoilLogger />
      </RecoilRoot>
    );
    expect(container).toBeTruthy();
  });
});

describe('RecoilLogger', () => {
  it('waits for selected values before logging a transaction', async () => {
    const entries: any[] = [];

    const UpdateAtom = () => {
      const setValue = useSetRecoilState(trackedAtom);

      return <button onClick={() => setValue('updated')}>Update</button>;
    };

    const { getByRole } = render(
      <RecoilRoot>
        <RecoilLogger
          values={[trackedAtom]}
          logger={() => (entry) => entries.push(entry)}
        />
        <UpdateAtom />
      </RecoilRoot>
    );

    fireEvent.click(getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(entries).toHaveLength(1);
      expect(entries[0]).toMatchObject({
        prevState: { 'logger-test-atom': 'initial' },
        nextState: { 'logger-test-atom': 'updated' },
        action: {
          description: 'Updated keys: logger-test-atom',
          'logger-test-atom': 'updated',
        },
      });
    });
  });
});
