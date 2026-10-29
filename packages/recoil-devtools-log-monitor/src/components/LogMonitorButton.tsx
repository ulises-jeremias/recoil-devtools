import React, { CSSProperties, FC, useState } from 'react';
import { Base16Theme } from 'base16';
import { brighten } from '../helpers';

const styles: { base: CSSProperties } = {
  base: {
    cursor: 'pointer',
    appearance: 'none',
    border: 0,
    fontWeight: 'bold',
    fontFamily: 'inherit',
    borderRadius: 3,
    padding: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 5,
    marginBottom: 5,
    flexGrow: 1,
    display: 'inline-block',
    fontSize: '0.8em',
    color: 'white',
    textDecoration: 'none',
  },
};

interface Props {
  theme: Base16Theme;
  onClick?: () => void;
  enabled: boolean;
  children?: React.ReactNode;
}

const LogMonitorButton: FC<Props> = ({
  theme,
  onClick = () => {},
  enabled,
  children,
}) => {
  const [hovered, setHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleMouseDown = () => {};

  const handleMouseUp = () => {};

  const handleClick = () => {
    if (!enabled) {
      return;
    }
    onClick();
  };

  let style = {
    ...styles.base,
    backgroundColor: theme.base02,
  };
  if (enabled && hovered) {
    style = {
      ...style,
      backgroundColor: brighten(theme.base02, 0.2),
    };
  }
  if (!enabled) {
    style = {
      ...style,
      opacity: 0.2,
      cursor: 'not-allowed',
      backgroundColor: 'transparent',
    };
  }
  return (
    <button
      type="button"
      disabled={!enabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      style={style}
    >
      {children}
    </button>
  );
};

export default LogMonitorButton;
