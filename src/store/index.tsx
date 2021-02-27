import { makeAutoObservable } from 'mobx';
import React from 'react';
import { AsyncTrunk, ignore } from 'mobx-sync';
import fme from '../shared/FigmaMessageEmitter';

const STORAGE_KEY = '__figma_mobx_sync__';

interface TooltipSettings {
  position: string;
  width: boolean;
  height: boolean;
  fontFamily: boolean;
  fontStyle: boolean;
  fontSize: boolean;
  color: boolean;
  opacity: boolean;
  stroke: boolean;
}
class RootStore {
  constructor() {
    makeAutoObservable(this);
  }

  labels = true;
  color = '#1745E8';

  @ignore
  selection = [];

  @ignore
  fill: 'dashed' | 'fill' | 'stroke' | 'fill-stroke' = 'stroke';

  @ignore
  dashDistance: number = 0;

  @ignore
  lineEnding: 'normal' | 'none' | 'arrow' | 'arrow-filled' = 'normal';

  @ignore
  lineDistance: number = 0;

  @ignore
  surrounding = {
    labels: false,
    topBar: false,
    leftBar: false,
    rightBar: false,
    bottomBar: false,
    horizontalBar: false,
    verticalBar: false,
    center: false,
    tooltip: 'top',
  };

  @ignore
  tooltip: TooltipSettings = {
    position: '',
    width: true,
    height: true,
    fontFamily: false,
    fontStyle: false,
    fontSize: false,
    color: false,
    opacity: false,
    stroke: false,
  };

  setColor(color: string) {
    this.color = color;
  }

  setLabels(labels: boolean) {
    this.labels = labels;
  }

  setTooltipPosition(position) {
    this.tooltip.position = position;
  }

  toggleTooltipSetting(key: keyof Omit<TooltipSettings, 'position'>) {
    const truthyFlags = Object.keys(this.tooltip).filter((key) => {
      if (typeof this.tooltip[key] === 'boolean') {
        return this.tooltip[key];
      }
    }).length;

    if (truthyFlags > 1 || !this.tooltip[key]) {
      this.tooltip = {
        ...this.tooltip,
        [key]: !this.tooltip[key],
      };
    }
  }

  setTooltipSettings(settings) {
    this.tooltip = {
      ...this.tooltip,
      ...settings,
    };
  }

  setFill(fill) {
    this.fill = fill;
  }

  setDashDistance(distance: number) {
    this.dashDistance = distance;
  }

  setLineEnding(lineEnding) {
    this.lineEnding = lineEnding;
  }

  setLineDistance(lineDistance) {
    this.lineDistance = lineDistance;
  }

  setSurrounding(surrounding) {
    this.surrounding = surrounding;
  }

  setSelection(selection = []) {
    this.selection = selection;
  }
}

const rootStore = new RootStore();

export type TStore = RootStore;

const StoreContext = React.createContext<TStore | null>(null);

export const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};

export const trunk = new AsyncTrunk(rootStore, {
  storageKey: STORAGE_KEY,
  storage: {
    getItem(key: string) {
      fme.emit('storage get item', key);
      return new Promise((resolve) => fme.once('storage get item', resolve));
    },
    setItem(key: string, value: string) {
      fme.emit('storage set item', {
        key,
        value,
      });
      return new Promise((resolve) => fme.once('storage set item', resolve));
    },
    removeItem(key: string) {
      fme.emit('storage remove item', key);
      return new Promise((resolve) => fme.once('storage remove item', resolve));
    },
  },
});

export const getStoreFromMain = (): Promise<TStore | {}> => {
  return new Promise((resolve) => {
    fme.emit('storage', STORAGE_KEY);
    fme.once('storage', (store, emit) => {
      emit('store initialized');
      resolve(JSON.parse(store || '{}'));
    });
  });
};
