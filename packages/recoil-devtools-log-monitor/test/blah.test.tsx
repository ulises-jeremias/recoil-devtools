import React from 'react';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { LogMonitor } from '../src';

describe('Render', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <RecoilRoot>
        <LogMonitor />
      </RecoilRoot>
    );
    expect(container).toBeTruthy();
  });
});
