import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { Colors } from '../../components/ColorPicker';
import { Input } from '../../components/Input';
import Tooltip from '../../components/Tooltip';
import { EyeClosedIcon, EyeIcon } from '../../components/icons/EyeIcons';
import { RefreshIcon } from '../../components/icons/RefreshIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import EventEmitter from '../../shared/EventEmitter';
import { useStore } from '../../store';
import { theme } from '../../style';

import CenterChooser from './components/CenterChooser';
import LineChooser from './components/LineChooser';
import Viewer from './components/Viewer';

const Home: FunctionComponent = observer(() => {
  const store = useStore();

  useEffect(() => {
    EventEmitter.emit('resize', {
      width: 270,
      height: 520,
    });
  }, []);

  const removeAllMeasurements = () => {
    if (confirm('Do you really want to remove all measurements?')) {
      EventEmitter.emit('remove all measurements');
    }
  };

  const labelDotIndex = useMemo(() => {
    if (!store.labels) {
      return 0;
    } else if (store.labelsOutside) {
      return 1;
    }
    return 2;
  }, [store.labels, store.labelsOutside]);

  const changeLabel = () => {
    switch (labelDotIndex) {
      case 2:
        store.setLabelsOutside(true);
        break;
      case 0:
        store.setLabelsOutside(false);
        break;
      case 1:
        store.setLabels(false);
        break;
    }
  };

  return (
    <>
      <ViewerContainer>
        {/* {store.selection.length === 0 && (
          <ViewerOverlay>
            <span>
              Select a Layer
              <br />
              to get started
            </span>
          </ViewerOverlay>
        )} */}
        <Viewer />

        <Tooltip
          hover
          handler={React.forwardRef<HTMLDivElement, unknown>((_, ref) => (
            <Visibility ref={ref} onClick={() => store.toggleVisibility()}>
              {store.visibility ? <EyeIcon /> : <EyeClosedIcon />}
            </Visibility>
          ))}
        >
          Show/Hide
        </Tooltip>

        <Tooltip
          hover
          handler={React.forwardRef<HTMLDivElement, unknown>((_, ref) => (
            <Refresh
              ref={ref}
              active={store.selection.length > 0}
              onClick={() => store.sendMeasurements()}
            >
              <RefreshIcon />
            </Refresh>
          ))}
        >
          Reload measurements
        </Tooltip>

        <Tooltip
          hover
          handler={React.forwardRef<HTMLDivElement, unknown>((_, ref) => (
            <Trash ref={ref} onClick={removeAllMeasurements}>
              <TrashIcon />
            </Trash>
          ))}
        >
          Remove all measurements
        </Tooltip>

        {/* <Colors
          colors={theme.colors}
          onChange={(color) => store.setColor(color)}
          color={store.color}
        /> */}

        <Tooltip
          hover
          handler={React.forwardRef<HTMLDivElement, unknown>((_, ref) => (
            <LabelControl
              ref={ref}
              index={labelDotIndex}
              onClick={() => changeLabel()}
            >
              <div className="label">{labelDotIndex}</div>
              <div className="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </LabelControl>
          ))}
        >
          Show/Hide
        </Tooltip>
      </ViewerContainer>

      <LineChooser />
      <CenterChooser />

      {/* <InputContainer>
        <Toggle
          checked={store.labelsOutside}
          label="Show next to line"
          onChange={(e) => store.setLabelsOutside(e.currentTarget.checked)}
        />
      </InputContainer>
      <InputContainer>
        <Toggle
          checked={store.labels}
          label="Show label"
          onChange={(e) => store.setLabels(e.currentTarget.checked)}
        />
      </InputContainer> */}

      <InputContainer>
        <Input
          width={140}
          label="Unit-Pattern"
          value={store.labelPattern}
          onChange={(e) => store.setLabelPattern(e.currentTarget.value)}
        />

        <Tooltip
          handler={React.forwardRef<HTMLDivElement, unknown>((_, ref) => (
            <div ref={ref} className="question">
              ?
            </div>
          ))}
        >
          <div style={{ width: 200 }}>
            Units will be generated as followed
            <p>
              <strong>($###*2.5)px</strong>
            </p>
            the base structure is always
            <p>
              <strong>($)px</strong>
            </p>
            <p>
              <strong>$</strong> is the origin value, after that you can add a
              multiplier or divider (‘*’ or ‘/’) the <strong>#</strong> symbol
              is used to round numbers after the comma and how many decimal
              places you wanna have. Last but not least you can add whichever
              unit you like (mm,px,pt..)
            </p>
            <h3>Example</h3>
            <p>
              Imagine your base unit is 8px=1x. So when a square is 64px the
              measurement will be 8x as the result.
            </p>
            <strong>($###/8)x</strong>
          </div>
        </Tooltip>
      </InputContainer>

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

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px;
  border-width: 0 0 1px;
  border-color: #eee;
  border-style: solid;
  position: relative;
  .question {
    background-color: ${(props) => props.theme.hoverColor};
    position: absolute;
    right: 21px;
    top: 19px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    border-radius: 4px;
    color: ${(props) => props.theme.color};
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.color};
      color: ${(props) => props.theme.hoverColor};
    }
  }
`;

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

const LabelControl = styled(Refresh)<{ index?: number }>`
  position: absolute;
  right: 12px;
  bottom: 12px;
  left: initial;
  top: initial;
  cursor: pointer;
  border-radius: 7px;
  opacity: 1;
`;

const Trash = styled(Refresh)`
  top: initial;
  left: 12px;
  top: 12px;
  opacity: 1;
  z-index: 10;
  svg {
    margin: 1px 0 0;
  }
`;

const Visibility = styled(Refresh)`
  left: 48px;
  top: 12px;
  z-index: 10;
  opacity: 1;
`;

const ViewerContainer = styled.div`
  position: relative;
  height: 310px;
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
