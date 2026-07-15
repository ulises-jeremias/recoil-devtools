import React from 'react';
import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { RecoilDevtools } from '../src';

describe('ensure it renders', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <RecoilRoot>
        <RecoilDevtools />
      </RecoilRoot>
    );
    expect(container).toBeTruthy();
  });
});
