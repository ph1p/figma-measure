import React from 'react';

export default function Button({
  type = 'button',
  variant = 'primary',
  onClick = () => {},
  disabled = false,
  style = {},
  className = '',
  full = false,
  children
}) {
  return (
    <button
      onClick={onClick}
      type={type as 'button' | 'submit' | 'reset'}
      disabled={disabled}
      style={style}
      className={`button button--${variant} ${className} ${
        full ? 'button--full-width' : ''
      }`}
    >
      {children}
    </button>
  );
}
