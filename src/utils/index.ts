export const sendMessage = (action, options = {}) => {
  parent.postMessage(
    {
      pluginMessage: {
        options,
        action
      }
    },
    '*'
  );
};
