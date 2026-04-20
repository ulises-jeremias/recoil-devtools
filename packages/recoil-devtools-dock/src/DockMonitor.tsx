import {
  isValidElement,
  cloneElement,
  Children,
  useEffect,
  useState,
  useCallback,
  type FC,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { Dock } from 'react-dock';
import parseKey from 'parse-key';
import type { RecoilState } from 'recoil';
import { POSITIONS } from './constants';

const STORAGE_KEY = 'recoil-devtools-dock-state';

interface DockState {
  isVisible?: boolean;
  position?: Position;
  size?: number;
}

const loadState = (): DockState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveState = (state: DockState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
};

interface KeyObject {
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  sequence: string;
}

type Position = (typeof POSITIONS)[number];

export interface DockMonitorProps {
  values?: RecoilState<unknown>[];
  defaultPosition?: Position;
  defaultIsVisible?: boolean;
  defaultSize?: number;
  toggleVisibilityKey?: string;
  changePositionKey?: string;
  changeMonitorKey?: string;
  fluid?: boolean;
  persistState?: boolean;
  showShortcutButton?: boolean;
  children?: ReactNode;
}

const DockMonitor: FC<DockMonitorProps> = (props) => {
  const {
    toggleVisibilityKey = 'ctrl-h',
    changePositionKey = 'ctrl-q',
    changeMonitorKey = 'ctrl-m',
    children,
    defaultIsVisible = true,
    defaultPosition = 'right',
    defaultSize = 0.3,
    fluid = true,
    persistState = true,
    showShortcutButton = true,
  } = props;

  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (!persistState) return defaultIsVisible;
    const stored = loadState();
    return stored?.isVisible ?? defaultIsVisible;
  });
  const [position, setPosition] = useState<Position>(() => {
    if (!persistState) return defaultPosition;
    const stored = loadState();
    return stored?.position ?? defaultPosition;
  });
  const [size, setSize] = useState<number>(() => {
    if (!persistState) return defaultSize;
    const stored = loadState();
    return stored?.size ?? defaultSize;
  });
  const [childMonitorIndex, setChildMonitorIndex] = useState<number>(0);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);

  // Format shortcut key for display
  const formatShortcut = (key: string) => {
    return key
      .replace('ctrl', 'Ctrl')
      .replace('meta', '⌘')
      .replace('shift', '⇧')
      .replace('alt', '⌥')
      .split('-')
      .join(' + ');
  };

  const childrenCount = Children.count(children);
  if (childrenCount === 0) {
    console.error(
      '<DockMonitor> requires at least one monitor inside. ' +
        'Why dont you try <LogMonitor>? You can get it at ' +
        'https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-log-monitor.'
    );
  } else if (childrenCount > 1 && !changeMonitorKey) {
    console.error(
      '<DockMonitor> requires at least one monitor inside. ' +
        'Why don’t you try <LogMonitor>? You can get it at ' +
        'https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-log-monitor.'
    );
  } else if (childrenCount > 1 && !changeMonitorKey) {
    console.error(
      'You specified multiple monitors inside <DockMonitor> ' +
        'but did not provide `changeMonitorKey` prop to change them. ' +
        'Try specifying <DockMonitor changeMonitorKey="ctrl-m" /> ' +
        'and then press Ctrl-M.'
    );
  }

  const matchesKey = (key: KeyObject | undefined, event: KeyboardEvent) => {
    if (!key) {
      return false;
    }

    const charCode = event.keyCode || event.which;
    const char = String.fromCharCode(charCode);
    return (
      key.name.toUpperCase() === char.toUpperCase() &&
      key.alt === event.altKey &&
      key.ctrl === event.ctrlKey &&
      key.meta === event.metaKey &&
      key.shift === event.shiftKey
    );
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'SELECT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      // Ignore regular keys when focused on a field and no modifiers are active.
      if (!e.ctrlKey && !e.metaKey && !e.altKey && isInput) {
        return;
      }

      const visibilityKey = parseKey(toggleVisibilityKey);
      const positionKey = parseKey(changePositionKey);

      let monitorKey;
      if (changeMonitorKey) {
        monitorKey = parseKey(changeMonitorKey);
      }

      if (matchesKey(visibilityKey, e)) {
        e.preventDefault();
        setIsVisible((prevIsVisible) => !prevIsVisible);
      } else if (matchesKey(positionKey, e)) {
        e.preventDefault();
        setPosition((prevPos) => {
          const currentIdx = POSITIONS.indexOf(prevPos);
          return POSITIONS[(currentIdx + 1) % POSITIONS.length] ?? 'right';
        });
      } else if (matchesKey(monitorKey, e)) {
        e.preventDefault();
        setChildMonitorIndex(
          (prevIdx) => (prevIdx + 1) % Children.count(children)
        );
      }
    },
    [toggleVisibilityKey, changePositionKey, changeMonitorKey, children]
  );

  const handleSizeChange = (requestedSize: number) => {
    setSize(requestedSize);
  };

  const renderChild = (
    child: ReactNode,
    index: number,
    otherProps: Omit<DockMonitorProps, 'monitorState' | 'children' | 'fluid'>
  ) => {
    if (index !== childMonitorIndex) {
      return null;
    }

    if (!isValidElement(child)) {
      return child;
    }

    return cloneElement(child, { ...otherProps, ...child.props });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Persist state changes to localStorage
  useEffect(() => {
    if (persistState) {
      saveState({ isVisible, position, size });
    }
  }, [isVisible, position, size, persistState]);

  // Shortcut button styles
  const shortcutButtonStyle: CSSProperties = {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: '4px 8px',
    fontSize: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    zIndex: 1000,
  };

  // Shortcuts modal styles
  const shortcutsModalStyle: CSSProperties = {
    position: 'absolute',
    top: 30,
    right: 4,
    padding: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    zIndex: 1000,
    minWidth: '180px',
  };

  // Build shortcuts list
  const shortcuts = [
    { label: 'Toggle visibility', key: formatShortcut(toggleVisibilityKey) },
    ...(changePositionKey
      ? [{ label: 'Change position', key: formatShortcut(changePositionKey) }]
      : []),
    ...(changeMonitorKey && childrenCount > 1
      ? [{ label: 'Change monitor', key: formatShortcut(changeMonitorKey) }]
      : []),
  ];

  return (
    <Dock
      position={position}
      isVisible={isVisible}
      size={size}
      fluid={fluid}
      onSizeChange={handleSizeChange}
      dimMode="none"
    >
      {showShortcutButton && (
        <button
          style={shortcutButtonStyle}
          onClick={() => setShowShortcuts(!showShortcuts)}
          onBlur={() => setShowShortcuts(false)}
          title="Show keyboard shortcuts"
        >
          ⌨
        </button>
      )}
      {showShortcuts && (
        <div style={shortcutsModalStyle}>
          <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
            Keyboard Shortcuts
          </div>
          {shortcuts.map((shortcut, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <span>{shortcut.label}</span>
              <span style={{ fontWeight: 'bold', marginLeft: 16 }}>
                {shortcut.key}
              </span>
            </div>
          ))}
        </div>
      )}
      {Children.map(children, (child: ReactNode, index) =>
        renderChild(child, index, props)
      )}
    </Dock>
  );
};

export default DockMonitor;
