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
