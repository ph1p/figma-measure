import { observer } from 'mobx-react';
import { useMemo } from 'preact/hooks';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { Colors } from '../../components/ColorPicker';
import { EmptyScreenImage } from '../../components/EmptyScreenImage';
import { Input } from '../../components/Input';
import Tooltip from '../../components/Tooltip';
import {
  AttachedIcon,
  DetachedIcon,
} from '../../components/icons/DetachedIcon';
import { RefreshIcon } from '../../components/icons/RefreshIcon';
import { SuccessIcon } from '../../components/icons/SuccessIcon';
import { WarningIcon } from '../../components/icons/WarningIcon';
import { useStore } from '../../store';

import CenterChooser from './components/CenterChooser';
import LineChooser from './components/LineChooser';
import Viewer from './components/Viewer';

const Home: FunctionComponent = observer(() => {
  const store = useStore();

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
            <EmptyScreenImage color={store.color} />
            <span>
              select an element to
              <br />
              start measuring
            </span>
          </ViewerOverlay>
        )}

        <Viewer />

        {!store.detached && (
          <Refresh
            title="Reload measurements"
            active={store.selection.length > 0}
            onClick={() => store.sendMeasurements()}
          >
            <RefreshIcon />
          </Refresh>
        )}

        <Detached
          title={`${store.detached ? 'Attach' : 'Detach'} measurements`}
          onClick={() => {
            store.setDetached(!store.detached);
          }}
        >
          {store.detached ? <DetachedIcon /> : <AttachedIcon />}
          <div className="hint">
            {store.detached ? <WarningIcon /> : <SuccessIcon />}
          </div>
        </Detached>

        <Colors />

        <LabelControl
          title="Change label alignment"
          index={labelDotIndex}
          onClick={() => {
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
      </ViewerContainer>

      <LineChooser />
      <CenterChooser />

      <InputContainer>
        <Input
          width={140}
          label="Units"
          placeholder="($)px, ($##*2.1), cm..."
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
    background-color: var(--figma-color-bg-hover);
    position: absolute;
    left: 50px;
    top: 19px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    border-radius: 4px;
    color: var(--figma-color-bg-inverse);
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
  background-color: var(--figma-color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 500;
  z-index: 20;
  flex-direction: column;
  span {
    margin-top: 17px;
    color: #808080;
    font-weight: normal;
  }
`;

const Refresh = styled.div<{ active?: boolean }>`
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  border-radius: 11px;
  width: 30px;
  height: 30px;
  border: 1px solid var(--figma-color-bg-disabled);
  overflow: hidden;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--figma-color-bg-hover);

  > svg path {
    fill: var(--figma-color-text);
  }

  &:hover {
    border-color: ${(props) => props.theme.color};
    > svg {
      path {
        fill: ${(props) => props.theme.color};
      }
    }
  }
  &:active {
    border-color: ${(props) => props.theme.color};
  }
`;

const LabelControl = styled(Refresh)<{ index?: number }>`
  display: block;
  position: absolute;
  right: 12px;
  bottom: 12px;
  left: initial;
  top: initial;
  cursor: pointer;
  border-radius: 10px;
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
      background-color: var(--figma-color-bg-disabled);
      display: inline-block;

      &:nth-child(${(p) => p.index}) {
        background-color:  ${(p) => p.theme.color};
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

const Detached = styled(Refresh)`
  top: initial;
  left: 12px;
  top: 12px;
  opacity: 1;
  z-index: 21;
  overflow: initial;
  svg {
    margin: 0;
  }
  .hint {
    position: absolute;
    right: -10px;
    top: -10px;
  }
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
