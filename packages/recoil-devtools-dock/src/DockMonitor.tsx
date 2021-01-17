import React, {
  isValidElement,
  cloneElement,
  Children,
  FC,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import Dock from 'react-dock';
import parseKey from 'parse-key';
import { RecoilState } from 'recoil';
import { POSITIONS } from './constants';

interface KeyObject {
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  sequence: string;
}

type Position = 'left' | 'top' | 'right' | 'bottom';

export interface DockMonitorProps {
  values?: RecoilState<any>[];
  defaultPosition?: Position;
  defaultIsVisible?: boolean;
  defaultSize?: number;
  toggleVisibilityKey?: string;
  changePositionKey?: string;
  changeMonitorKey?: string;
  fluid?: boolean;
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
  } = props;

  const [isVisible, setIsVisible] = useState<boolean>(defaultIsVisible);
  const [position, setPosition] = useState<Position>(defaultPosition);
  const [size, setSize] = useState<number>(defaultSize);
  const [childMonitorIndex, setChildMonitorIndex] = useState<number>(0);

  const childrenCount = Children.count(children);
  if (childrenCount === 0) {
    // eslint-disable-next-line no-console
    console.error(
      '<DockMonitor> requires at least one monitor inside. ' +
        'Why don’t you try <LogMonitor>? You can get it at ' +
        'https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-log-monitor.'
    );
  } else if (childrenCount > 1 && !changeMonitorKey) {
    // eslint-disable-next-line no-console
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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore regular keys when focused on a field
    // and no modifiers are active.
    if (
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      ((e.target! as { tagName?: string }).tagName === 'INPUT' ||
        (e.target! as { tagName?: string }).tagName === 'SELECT' ||
        (e.target! as { tagName?: string }).tagName === 'TEXTAREA' ||
        (e.target! as { isContentEditable?: boolean }).isContentEditable)
    ) {
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
      setIsVisible((isVisible) => !isVisible);
    } else if (matchesKey(positionKey, e)) {
      e.preventDefault();
      setPosition(
        (position) =>
          POSITIONS[(POSITIONS.indexOf(position) + 1) % POSITIONS.length]
      );
    } else if (matchesKey(monitorKey, e)) {
      e.preventDefault();
      setChildMonitorIndex(
        (childMonitorIndex) =>
          (childMonitorIndex + 1) % Children.count(children)
      );
    }
  }, []);

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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Dock
      position={position}
      isVisible={isVisible}
      size={size}
      fluid={fluid}
      onSizeChange={handleSizeChange}
      dimMode="none"
    >
      {Children.map(children, (child: ReactNode, index) =>
        renderChild(child, index, props)
      )}
    </Dock>
  );
};

export default DockMonitor;
