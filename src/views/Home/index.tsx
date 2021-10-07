import { observer } from 'mobx-react';
import { useRef, useMemo } from 'preact/hooks';
import React, { FunctionComponent } from 'react';
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
  const labelControlRef = useRef<any>(null);
  const visibilityRef = useRef<any>(null);

  const removeAllMeasurements = () => {
    if (confirm('Do you really want to remove all measurements?')) {
      EventEmitter.emit('remove all measurements');
    }
  };

  const labelDotIndex = useMemo(() => {
    if (!store.labels) {
      return 1;
    } else if (store.labelsOutside) {
      return 3;
    }
    return 2;
  }, [store.labels, store.labelsOutside]);

  const changeLabel = () => {
    switch (labelDotIndex) {
      case 2:
        store.setLabelsOutside(true);
        break;
      case 1:
        store.setLabelsOutside(false);
        break;
      case 3:
        store.setLabels(false);
        break;
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

        <Tooltip
          hover
          ref={visibilityRef}
          handler={observer(
            React.forwardRef<HTMLDivElement, unknown>((_, ref) => (
              <Visibility
                ref={ref}
                onClick={() => {
                  store.toggleVisibility();
                  visibilityRef.current.hide();
                }}
              >
                {store.visibility ? <EyeIcon /> : <EyeClosedIcon />}
              </Visibility>
            ))
          )}
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

        <Tooltip
          padding={6}
          borderRadius={12}
          handler={React.forwardRef<HTMLDivElement, unknown>((_, ref) => (
            <ColorControl ref={ref} />
          ))}
        >
          <Colors
            colors={theme.colors}
            onChange={(color) => store.setColor(color)}
            color={store.color}
          />
        </Tooltip>

        <Tooltip
          hover
          ref={labelControlRef}
          handler={React.forwardRef<HTMLDivElement, unknown>((_, ref) => (
            <LabelControl
              ref={ref}
              index={labelDotIndex}
              onClick={() => {
                labelControlRef.current.hide();
                changeLabel();
              }}
            >
              <div className="label"></div>
              <div className="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </LabelControl>
          ))}
        >
          Change label alignment
        </Tooltip>
      </ViewerContainer>

      <LineChooser />
      <CenterChooser />

      <InputContainer>
        <Input
          width={140}
          label="Units"
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
          <UnitDescription>
            You can write a "complex" pattern like this{' '}
            <strong>($###*2.5)</strong> or a simple one <strong>($)</strong>
            <p>
              <strong>$</strong> represents the value, after that you can add a
              multiplier or divider (<strong>*</strong> or <strong>/</strong>)
              the repetition of the <strong>#</strong> symbol indicates the
              number of digits after the decimal point.
              <br /> You can also fill the field with only one unit of
              measurement and everything will be automatically calculated based
              on 72dpi. (cm,mm,px,pt,dp,",in)
            </p>
            <h3>Example</h3>
            <p>
              Imagine your base unit is 8px=1x. So when a square is 64px the
              measurement will be 8x as the result.
            </p>
            <strong>($###/8)x</strong>
          </UnitDescription>
        </Tooltip>
      </InputContainer>
    </>
  );
});

const UnitDescription = styled.div`
  width: 200px;
  strong {
    background-color: #fff;
    border-radius: 3px;
    padding: 1px 3px;
    color: #000;
    display: inline-block;
  }
  h3 {
    margin: 5px 0 8px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px;
  position: relative;
  .question {
    background-color: ${(props) => props.theme.hoverColor};
    position: absolute;
    left: 50px;
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
  z-index: 20;
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

const ColorControl = styled(Refresh)`
  position: absolute;
  left: 12px;
  bottom: 12px;
  top: initial;
  opacity: 1;
  z-index: 4;
  &::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 3px;
    width: 22px;
    height: 22px;
    border-radius: 7px;
    background-color: ${(p) => p.theme.color};
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
  z-index: 2;
  .dots {
    display: flex;
    width: 85%;
    justify-content: space-evenly;
    margin: 0 auto;
    span {
      border-radius: 100%;
      width: 3px;
      height: 3px;
      background-color: #e3e3e3;
      display: inline-block;

      &:nth-child(${(p) => p.index}) {
        background-color: #000;
      }
    }
  }
  .label {
    height: 18px;
    position: relative;
    z-index: 5;
    &::before,
    &::after {
      background-color: ${(p) => p.theme.color};
      content: '';
      position: absolute;
    }
    &::before {
      left: 4px;
      width: 20px;
      height: 1px;
      top: 10px;
    }
    &::after {
      content: '';
      display: ${(p) => (p.index === 1 ? 'none' : 'block')};
      position: absolute;
      left: 10px;
      width: 8px;
      height: 3px;
      top: ${(p) => (p.index === 3 ? 5 : 9)}px;
    }
  }
`;

const Trash = styled(Refresh)`
  top: initial;
  left: 12px;
  top: 12px;
  opacity: 1;
  z-index: 21;
  svg {
    margin: 1px 0 0;
  }
`;

const Visibility = styled(Refresh)`
  left: 48px;
  top: 12px;
  z-index: 21;
  opacity: 1;
`;

const ViewerContainer = styled.div`
  position: relative;
  height: 355px;
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
