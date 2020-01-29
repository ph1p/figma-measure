import React, { useState, useEffect } from 'react';

export * from './AppContext';
export * from './style';
export * from './constants';
export * from './types';

export const sendMessage = (action, payload = {}, storage = false) => {
  parent.postMessage(
    {
      pluginMessage: {
        payload,
        action,
        storage
      }
    },
    '*'
  );
};

export const setStorage = (action, payload = {}) => {
  sendMessage(action, payload, true);
};

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
