import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { EyeClosedIcon, EyeIcon } from '../../components/icons/EyeIcons';
import { RefreshIcon } from '../../components/icons/RefreshIcon';
import { SpacingIcon } from '../../components/icons/SpacingIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import EventEmitter from '../../shared/EventEmitter';
import { useStore } from '../../store';

import CenterChooser from './components/CenterChooser';
import LineChooser from './components/LineChooser';
import Viewer from './components/Viewer';

const Home: FunctionComponent = observer(() => {
  const store = useStore();

  const hasSpacing = useMemo(() => {
    return store.selection.some((selection) => selection.hasSpacing);
  }, [store.selection]);

  useEffect(() => {
    EventEmitter.emit('resize', {
      width: 250,
      height: 429,
    });
  }, []);

  const refreshSelection = () =>
    EventEmitter.ask('current selection').then((data: string[]) =>
      store.setSelection(data)
    );

  const addSpacing = () => {
    EventEmitter.emit('draw spacing', {
      color: store.color,
      labels: store.labels,
      unit: store.unit,
      strokeOffset: store.strokeOffset,
      labelsOutside: store.labelsOutside,
    });
    refreshSelection();
  };

  const removeSpacing = () => {
    if (hasSpacing) {
      EventEmitter.emit('remove spacing');
      refreshSelection();
    }
  };

  const removeAllMeasurements = () => {
    if (confirm('Do you really want to remove all measurements?')) {
      EventEmitter.emit('remove all measurements');
    }
  };

  return (
    <>
      <ViewerContainer>
        {store.selection.length === 0 && (
          <ViewerOverlay>
            <span>
              Select a Layer
              <br />
              to get started
            </span>
          </ViewerOverlay>
        )}
        <Viewer />

        <Visibility onClick={() => store.toggleVisibility()}>
          {store.visibility ? <EyeIcon /> : <EyeClosedIcon />}
        </Visibility>

        <Refresh
          active={store.selection.length > 0}
          onClick={() => store.sendMeasurements()}
        >
          <RefreshIcon />
        </Refresh>

        <Trash onClick={removeAllMeasurements}>
          <TrashIcon />
        </Trash>

        {hasSpacing && (
          <RemoveSpacing onClick={removeSpacing}>
            <SpacingIcon remove />
          </RemoveSpacing>
        )}

        <Spacing active={store.selection.length === 2} onClick={addSpacing}>
          <SpacingIcon />
        </Spacing>
      </ViewerContainer>

      <LineChooser />
      <CenterChooser />

      {/* <button
        onClick={() =>
          EventEmitter.emit('outer', {
            direction: 'LEFT',
            depth: 1,
          })
        }
      >
        left
      </button>
      <button
        onClick={() =>
          EventEmitter.emit('outer', {
            direction: 'RIGHT',
            depth: 1,
          })
        }
      >
        right
      </button>
      <button
        onClick={() =>
          EventEmitter.emit('outer', {
            direction: 'TOP',
            depth: 1,
          })
        }
      >
        top
      </button>
      <button
        onClick={() =>
          EventEmitter.emit('outer', {
            direction: 'BOTTOM',
            depth: 1,
          })
        }
      >
        bottom
      </button> */}
    </>
  );
});

const ViewerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  z-index: 3;
`;

const Spacing = styled.div<{ active?: boolean; disable?: boolean }>`
  position: absolute;
  right: 12px;
  bottom: 12px;
  cursor: pointer;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
  border-radius: 7px;
  line {
    stroke: ${(props) => props.theme.color};
  }
  &:hover {
    rect {
      stroke: ${(props) => props.theme.color};
    }
  }
`;

const RemoveSpacing = styled(Spacing)`
  right: 54px;
  opacity: 1;
`;

const Refresh = styled.div<{ active?: boolean }>`
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  border-radius: 11px;
  width: 30px;
  height: 30px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  opacity: ${(props) => (props.active ? 1 : 0.5)};

  svg {
    margin: -2px 0 0 -2px;
  }
  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
  }
  &:active {
    border-color: ${(props) => props.theme.color};
  }
`;

const Trash = styled(Refresh)`
  top: initial;
  left: 12px;
  bottom: 12px;
  opacity: 1;
  z-index: 10;
  svg {
    margin: 1px 0 0;
  }
`;

const Visibility = styled(Refresh)`
  left: 12px;
  top: 12px;
  z-index: 10;
  opacity: 1;
`;

const ViewerContainer = styled.div`
  position: relative;
  height: 271px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    user-select: none;
    g {
      cursor: pointer;
    }
  }
`;

export default Home;
