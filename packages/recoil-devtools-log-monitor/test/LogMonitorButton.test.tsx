import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ulisesjcf } from 'recoil-devtools-themes';
import LogMonitorButton from '../src/components/LogMonitorButton';

describe('LogMonitorButton', () => {
  it('renders a named button that does not submit its enclosing form', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <LogMonitorButton theme={ulisesjcf} enabled onClick={onClick}>
          Reset
        </LogMonitorButton>
      </form>
    );

    const button = screen.getByRole('button', { name: 'Reset' });
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('uses native Tab, Enter, and Space keyboard behavior', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <LogMonitorButton theme={ulisesjcf} enabled onClick={onClick}>
        Reset
      </LogMonitorButton>
    );

    const button = screen.getByRole('button', { name: 'Reset' });
    await user.tab();
    expect(document.activeElement).toBe(button);

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('suppresses disabled pointer and keyboard activation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <LogMonitorButton theme={ulisesjcf} enabled={false} onClick={onClick}>
        Reset
      </LogMonitorButton>
    );

    const button = screen.getByRole('button', { name: 'Reset' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.style.cursor).toBe('not-allowed');

    await user.click(button);
    await user.tab();
    await user.keyboard('{Enter} ');

    expect(document.activeElement).not.toBe(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('preserves hover styling for enabled buttons', () => {
    render(
      <LogMonitorButton theme={ulisesjcf} enabled>
        Reset
      </LogMonitorButton>
    );

    const button = screen.getByRole('button', { name: 'Reset' });
    const restingBackground = button.style.backgroundColor;

    fireEvent.mouseEnter(button);
    expect(button.style.backgroundColor).not.toBe(restingBackground);

    fireEvent.mouseLeave(button);
    expect(button.style.backgroundColor).toBe(restingBackground);
  });
});
