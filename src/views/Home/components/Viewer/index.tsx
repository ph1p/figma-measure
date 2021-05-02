import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { TooltipPositions } from '../../../../shared/interfaces';
import { useStore } from '../../../../store';

import Line from './components/Line';
import { Spacing } from './components/Spacing';

const Viewer: FunctionComponent = observer(() => {
  const store = useStore();

  const clickTooltip = (e) => {
    if (store.selection.length > 0) {
      if (store.surrounding.tooltip === e.currentTarget.dataset.direction) {
        store.setSurrounding({
          ...store.surrounding,
          tooltip: TooltipPositions.NONE,
        });
      } else {
        store.setSurrounding({
          ...store.surrounding,
          tooltip: TooltipPositions[e.currentTarget.dataset.direction],
        });
      }
    }
  };

  const clickCorner = (e) => {
    if (store.selection.length > 0) {
      let [first, second] = e.currentTarget.dataset.direction.split('-');

      first += 'Bar';
      second += 'Bar';

      store.setSurrounding({
        ...store.surrounding,
        [first]: !store.surrounding[first],
        [second]: !store.surrounding[second],
      });
    }
  };

  return (
    <Wrapper>
      <Tooltips>
        <Tooltip
          data-direction="TOP"
          onClick={clickTooltip}
          active={store.surrounding.tooltip === TooltipPositions.TOP}
        />
        <Tooltip
          data-direction="BOTTOM"
          onClick={clickTooltip}
          active={store.surrounding.tooltip === TooltipPositions.BOTTOM}
        />
        <Tooltip
          data-direction="LEFT"
          onClick={clickTooltip}
          active={store.surrounding.tooltip === TooltipPositions.LEFT}
        />
        <Tooltip
          data-direction="RIGHT"
          onClick={clickTooltip}
          active={store.surrounding.tooltip === TooltipPositions.RIGHT}
        />

        <Lines>
          <Line.Corner
            labels={store.labels}
            labelsOutside={store.labelsOutside}
            onClick={clickCorner}
            active={store.surrounding.leftBar && store.surrounding.topBar}
            data-direction="top-left"
          />
          <Line.Horizontal
            labels={store.labels}
            labelsOutside={store.labelsOutside}
            active={store.surrounding.topBar}
            onClick={() =>
              store.setSurrounding({
                ...store.surrounding,
                topBar: !store.surrounding.topBar,
              })
            }
          />
          <Line.Corner
            labels={store.labels}
            labelsOutside={store.labelsOutside}
            onClick={clickCorner}
            active={store.surrounding.rightBar && store.surrounding.topBar}
            data-direction="top-right"
          />
          <Line.Vertical
            labels={store.labels}
            labelsOutside={store.labelsOutside}
            active={store.surrounding.leftBar}
            onClick={() =>
              store.setSurrounding({
                ...store.surrounding,
                leftBar: !store.surrounding.leftBar,
              })
            }
          />

          <div>
            <Spacing />

            <OverlayAndPadding>
              <Line.Vertical
                labels={store.labels}
                labelsOutside={store.labelsOutside}
                className="top"
                style={{ height: 26 }}
              />
              <Line.Vertical
                labels={store.labels}
                labelsOutside={store.labelsOutside}
                className="bottom"
                style={{ height: 26 }}
              />

              <OverlayRect className="center">
                {/* <Line.Vertical
                  labels={store.labels}
                  labelsOutside={store.labelsOutside}
                  style={{ height: 29, left: 12, top: 3 }}
                />
                <Line.Horizontal
                  labels={store.labels}
                  labelsOutside={store.labelsOutside}
                  style={{ width: 29, right: 0, top: -17 }}
                /> */}
              </OverlayRect>

              <Line.Horizontal
                labels={store.labels}
                labelsOutside={store.labelsOutside}
                className="left"
                style={{ width: 26 }}
              />
              <Line.Horizontal
                labels={store.labels}
                labelsOutside={store.labelsOutside}
                className="right"
                style={{ width: 26 }}
              />
            </OverlayAndPadding>
          </div>

          <Line.Vertical
            labels={store.labels}
            labelsOutside={store.labelsOutside}
            active={store.surrounding.rightBar}
            onClick={() =>
              store.setSurrounding({
                ...store.surrounding,
                rightBar: !store.surrounding.rightBar,
              })
            }
          />
          <Line.Corner
            labels={store.labels}
            labelsOutside={store.labelsOutside}
            onClick={clickCorner}
            active={store.surrounding.leftBar && store.surrounding.bottomBar}
            data-direction="left-bottom"
          />
          <Line.Horizontal
            labels={store.labels}
            labelsOutside={store.labelsOutside}
            active={store.surrounding.bottomBar}
            onClick={() =>
              store.setSurrounding({
                ...store.surrounding,
                bottomBar: !store.surrounding.bottomBar,
              })
            }
          />
          <Line.Corner
            labels={store.labels}
            labelsOutside={store.labelsOutside}
            onClick={clickCorner}
            active={store.surrounding.rightBar && store.surrounding.bottomBar}
            data-direction="right-bottom"
          />
        </Lines>
      </Tooltips>
    </Wrapper>
  );
});

const OverlayRect = styled.div`
  width: 45px;
  height: 45px;
  border: 7px solid transparent;
  margin: 3px;
  border-radius: 10px;
  position: relative;
  &:hover {
    border-color: ${(props) => props.theme.hoverColor};
  }
  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: -4px;
    border: 1px solid ${(props) => props.theme.softColor};
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    border-radius: 7px;
  }
`;

const Tooltip = styled.div.attrs<{ active?: boolean }>((props) => ({
  className: props.active ? 'active' : '',
}))<{ active?: boolean }>`
  height: 20px;
  width: 20px;
  border: 1px solid ${(props) => props.theme.softColor};
  background-color: #fff;
  align-self: center;
  justify-self: center;
  margin: 4px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  &:hover,
  &:hover::before,
  &:hover::after {
    background-color: ${(props) => props.theme.softColor};
  }
  &::after,
  &::before {
    content: '';
    position: absolute;
  }
  &::before {
    width: 8px;
    height: 8px;
    border: 1px solid ${(props) => props.theme.softColor};
    border-radius: 2px;
    transform: rotate(45deg);
    z-index: -1;
  }
  &::after {
    width: 8px;
    height: 8px;
    background-color: #fff;
    z-index: 1;
    transform: rotate(45deg);
  }

  &.active,
  &.active::before,
  &.active::after {
    background-color: ${(props) => props.theme.color};
    border-color: ${(props) => props.theme.color};
  }

  &[data-direction='TOP'] {
    grid-area: top;
    &::before {
      left: 4px;
      bottom: -4px;
    }
    &::after {
      left: 5px;
      bottom: -3px;
    }
  }
  &[data-direction='BOTTOM'] {
    grid-area: bottom;
    &::before {
      left: 4px;
      top: -4px;
    }
    &::after {
      left: 5px;
      top: -3px;
    }
  }
  &[data-direction='LEFT'] {
    grid-area: left;
    &::before {
      right: -4px;
      top: 4px;
    }
    &::after {
      right: -3px;
      top: 5px;
    }
  }
  &[data-direction='RIGHT'] {
    grid-area: right;
    &::before {
      top: 4px;
      left: -4px;
    }
    &::after {
      top: 5px;
      left: -3px;
    }
  }
`;

const Tooltips = styled.div`
  display: grid;
  grid-template-areas: '. top .' 'left center right' '. bottom .';
  ${Tooltip}
`;

const OverlayAndPadding = styled.div`
  display: grid;
  grid-template-areas: '. top .' 'left center right' '. bottom .';
  position: relative;
  > div {
    align-self: center;
    justify-self: center;
  }
  .center {
    grid-area: center;
  }
  .top {
    grid-area: top;
  }
  .bottom {
    grid-area: bottom;
  }
  .left {
    grid-area: left;
  }
  .right {
    grid-area: right;
  }
`;

const Lines = styled.div`
  grid-area: center;
  display: grid;
  grid-template-rows: 21px 1fr 21px;
  grid-template-columns: 21px 1fr 21px;
  height: 100%;
  width: 171px;
  height: 171px;
  margin: 0 auto;
  > div {
    position: relative;
    align-self: center;
    justify-self: center;
  }
`;

const Wrapper = styled.div`
  width: 229px;
  height: 229px;
  /* width: 145px;
  height: 145px; */
`;

export default Viewer;
