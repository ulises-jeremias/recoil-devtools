import React from 'react';
import { render } from '@testing-library/react';
import { DockMonitor } from '../src';

describe('Render', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <DockMonitor>
        <div />
      </DockMonitor>
    );
    expect(container).toBeTruthy();
  });
});

describe('DockMonitor validation', () => {
  it('links to the Recoil LogMonitor for missing children', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<DockMonitor>{[]}</DockMonitor>);

    expect(error).toHaveBeenCalledWith(
      '<DockMonitor> requires at least one monitor inside. ' +
        'Why dont you try <LogMonitor>? You can get it at ' +
        'https://github.com/ulises-jeremias/recoil-devtools/tree/main/packages/recoil-devtools-log-monitor.'
    );
  });

  it('reports the missing monitor switch key for multiple children', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <DockMonitor
        changeMonitorKey=""
        showShortcutButton={false}
        persistState={false}
      >
        <div />
        <div />
      </DockMonitor>
    );

    expect(error).toHaveBeenCalledWith(
      'You specified multiple monitors inside <DockMonitor> ' +
        'but did not provide `changeMonitorKey` prop to change them. ' +
        'Try specifying <DockMonitor changeMonitorKey="ctrl-m" /> ' +
        'and then press Ctrl-M.'
    );
    expect(error).not.toHaveBeenCalledWith(
      '<DockMonitor> requires at least one monitor inside. ' +
        'Why dont you try <LogMonitor>? You can get it at ' +
        'https://github.com/ulises-jeremias/recoil-devtools/tree/main/packages/recoil-devtools-log-monitor.'
    );
  });
});
