import React, { type ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Dock } from 'react-dock';
import { DockMonitor } from '../src';

// Keep these tests at the monitor boundary; the existing smoke test renders
// react-dock itself, whose animation and geometry are outside this component.
vi.mock('react-dock', () => ({
  Dock: ({
    children,
    isVisible,
    position,
    size,
  }: ComponentProps<typeof Dock>) => (
    <section
      aria-label="Dock"
      hidden={!isVisible}
      data-position={position}
      data-size={size}
    >
      {typeof children === 'function' ? null : children}
    </section>
  ),
}));

const storageKey = 'recoil-devtools-dock-state';

function Monitor({ label = 'Monitor' }: { label?: string }) {
  return <p>{label}</p>;
}

function pressShortcut(key: string, ctrlKey = true, shiftKey = false) {
  return fireEvent.keyDown(window, {
    key,
    keyCode: key.toUpperCase().charCodeAt(0),
    ctrlKey,
    shiftKey,
  });
}

function dock() {
  return screen.getByRole('region', { hidden: true });
}

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe('DockMonitor', () => {
  it('renders the active child and preserves its own props', () => {
    render(
      <DockMonitor persistState={false}>
        <Monitor label="First" />
        <Monitor label="Second" />
      </DockMonitor>
    );
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.queryByText('Second')).toBeNull();
    pressShortcut('m');
    expect(screen.getByText('Second')).toBeTruthy();
    expect(screen.queryByText('First')).toBeNull();
    pressShortcut('m');
    expect(screen.getByText('First')).toBeTruthy();
  });

  it.each(['left', 'top', 'right', 'bottom'] as const)(
    'uses the requested %s position',
    (position) => {
      render(
        <DockMonitor defaultPosition={position} persistState={false}>
          <Monitor />
        </DockMonitor>
      );
      expect(dock().dataset.position).toBe(position);
    }
  );

  it('toggles visibility with Ctrl+H and consumes the shortcut', () => {
    render(
      <DockMonitor persistState={false}>
        <Monitor />
      </DockMonitor>
    );
    expect(dock().hidden).toBe(false);
    expect(pressShortcut('h')).toBe(false);
    expect(dock().hidden).toBe(true);
    pressShortcut('h');
    expect(dock().hidden).toBe(false);
  });

  it('can reveal a dock that starts hidden', () => {
    render(
      <DockMonitor defaultIsVisible={false} persistState={false}>
        <Monitor />
      </DockMonitor>
    );
    expect(dock().hidden).toBe(true);
    pressShortcut('h');
    expect(dock().hidden).toBe(false);
  });

  it('cycles through all positions with Ctrl+Q, including wraparound', () => {
    render(
      <DockMonitor defaultPosition="right" persistState={false}>
        <Monitor />
      </DockMonitor>
    );
    for (const position of ['bottom', 'left', 'top', 'right']) {
      expect(pressShortcut('q')).toBe(false);
      expect(dock().dataset.position).toBe(position);
    }
  });

  it('ignores keys with missing or extra modifiers', () => {
    render(
      <DockMonitor persistState={false}>
        <Monitor />
      </DockMonitor>
    );
    expect(pressShortcut('h', false)).toBe(true);
    expect(pressShortcut('h', true, true)).toBe(true);
    expect(dock().hidden).toBe(false);
  });

  it('honors custom shortcuts and updates them when props change', () => {
    const { rerender } = render(
      <DockMonitor toggleVisibilityKey="ctrl-x" persistState={false}>
        <Monitor />
      </DockMonitor>
    );
    pressShortcut('h');
    expect(dock().hidden).toBe(false);
    pressShortcut('x');
    expect(dock().hidden).toBe(true);
    rerender(
      <DockMonitor toggleVisibilityKey="ctrl-y" persistState={false}>
        <Monitor />
      </DockMonitor>
    );
    pressShortcut('x');
    expect(dock().hidden).toBe(true);
    pressShortcut('y');
    expect(dock().hidden).toBe(false);
  });

  it('opens and dismisses the keyboard shortcut help with its button', async () => {
    const user = userEvent.setup();
    render(
      <DockMonitor persistState={false}>
        <Monitor />
      </DockMonitor>
    );
    const button = screen.getByTitle('Show keyboard shortcuts');
    await user.click(button);
    expect(screen.getByText('Keyboard Shortcuts')).toBeTruthy();
    expect(screen.getByText('Ctrl + h')).toBeTruthy();
    expect(screen.queryByText('Change monitor')).toBeNull();
    await user.click(button);
    expect(screen.queryByText('Keyboard Shortcuts')).toBeNull();
    await user.click(button);
    await user.tab();
    expect(screen.queryByText('Keyboard Shortcuts')).toBeNull();
  });

  it('can disable the shortcut help button', () => {
    render(
      <DockMonitor showShortcutButton={false} persistState={false}>
        <Monitor />
      </DockMonitor>
    );
    expect(screen.queryByTitle('Show keyboard shortcuts')).toBeNull();
  });

  it('restores stored state and persists subsequent changes', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ isVisible: false, position: 'left', size: 0.5 })
    );
    render(
      <DockMonitor>
        <Monitor />
      </DockMonitor>
    );
    expect(dock().hidden).toBe(true);
    expect(dock().dataset.position).toBe('left');
    expect(dock().dataset.size).toBe('0.5');
    pressShortcut('h');
    pressShortcut('q');
    expect(JSON.parse(localStorage.getItem(storageKey) ?? '{}')).toEqual({
      isVisible: true,
      position: 'top',
      size: 0.5,
    });
  });

  it('uses defaults and leaves stored state untouched when persistence is off', () => {
    const stored = JSON.stringify({
      isVisible: false,
      position: 'left',
      size: 0.5,
    });
    localStorage.setItem(storageKey, stored);
    render(
      <DockMonitor persistState={false}>
        <Monitor />
      </DockMonitor>
    );
    expect(dock().hidden).toBe(false);
    expect(dock().dataset.position).toBe('right');
    expect(dock().dataset.size).toBe('0.3');
    pressShortcut('q');
    expect(localStorage.getItem(storageKey)).toBe(stored);
  });

  it('falls back to defaults when stored JSON is invalid', () => {
    localStorage.setItem(storageKey, '{');
    render(
      <DockMonitor>
        <Monitor />
      </DockMonitor>
    );
    expect(dock().hidden).toBe(false);
    expect(dock().dataset.position).toBe('right');
  });

  it('removes its keyboard listener on unmount', () => {
    const addListener = vi.spyOn(window, 'addEventListener');
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(
      <DockMonitor persistState={false}>
        <Monitor />
      </DockMonitor>
    );
    const listener = addListener.mock.calls.find(
      ([type]) => type === 'keydown'
    )?.[1];
    expect(listener).toBeTypeOf('function');
    unmount();
    expect(removeListener).toHaveBeenCalledWith('keydown', listener);
  });
});
