import { STORAGE_KEY } from '../shared/constants';
import FigmaMessageEmitter from '../shared/FigmaMessageEmitter';

export const getState = async () =>
  JSON.parse(await figma.clientStorage.getAsync(STORAGE_KEY));

FigmaMessageEmitter.on('storage', async (key, send) => {
  try {
    send('storage', await figma.clientStorage.getAsync(key));
  } catch {
    send('storage', '{}');
  }
});

FigmaMessageEmitter.on('storage set item', ({ key, value }, send) => {
  figma.clientStorage.setAsync(key, value);

  send('storage set item', true);
});

FigmaMessageEmitter.on('storage get item', async (key, send) => {
  try {
    const store = await figma.clientStorage.getAsync(key);

    send('storage get item', store[key]);
  } catch {
    send('storage get item', false);
  }
});

FigmaMessageEmitter.on('storage remove item', async (key, send) => {
  try {
    await figma.clientStorage.setAsync(key, undefined);

    send('storage remove item', true);
  } catch {
    send('storage remove item', false);
  }
});

FigmaMessageEmitter.once('store initialized', () => {});
