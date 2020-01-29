import { useState, useEffect } from 'react';

export * from './AppContext';
export * from './style';
export * from './constants';

export const sendMessage = (action, payload = {}) => {
  parent.postMessage(
    {
      pluginMessage: {
        payload,
        action
      }
    },
    '*'
  );
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
