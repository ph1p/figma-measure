export * from './AppContext';
export * from './style';

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
