import React from 'react';
import * as ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import DockMonitor from '../src/DockMonitor';

describe('Render', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<div />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('DockMonitor validation', () => {
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
        'Why don’t you try <LogMonitor>? You can get it at ' +
        'https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-log-monitor.'
    );
  });
});
