import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { RecoilRoot, atom, useSetRecoilState } from 'recoil';
import { RecoilLogger } from '../src';

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it('logs selected state changes through the default console logger', async () => {
    const group = vi.spyOn(console, 'group').mockImplementation(() => {});
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const groupEnd = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    const UpdateAtom = () => {
      const setValue = useSetRecoilState(trackedAtom);

      return <button onClick={() => setValue('updated')}>Update</button>;
    };

    const { getByRole } = render(
      <RecoilRoot>
        <RecoilLogger values={[trackedAtom]} />
        <UpdateAtom />
      </RecoilRoot>
    );

    fireEvent.click(getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(group).toHaveBeenCalledOnce();
      expect(log).toHaveBeenCalledWith(
        '%c prev state',
        'color: #9E9E9E; font-weight: bold',
        { 'logger-test-atom': 'initial' }
      );
      expect(log).toHaveBeenCalledWith(
        '%c next state',
        'color: #4CAF50; font-weight: bold',
        { 'logger-test-atom': 'updated' }
      );
      expect(groupEnd).toHaveBeenCalledOnce();
    });
  });
});
