import React from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';

export default function ButtonLink({
  label,
  to,
  button = 'primary',
  exact = true,
  className = ''
}) {
  let history = useHistory();
  let match = useRouteMatch({
    path: to,
    exact
  });

  return (
    <button
      className={`${className} button button--${button} ${match ? 'active' : ''}`}
      onClick={() => history.push(to)}
    >
      {label}
    </button>
  );
}
