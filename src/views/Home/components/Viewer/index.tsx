import { observer } from 'mobx-react';
import React, { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';

import EventEmitter from '../../../../shared/EventEmitter';
import { Alignments, TooltipPositions } from '../../../../shared/interfaces';
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

  const hasSpacing = useMemo(
    () => store.selection.some((selection) => selection.hasSpacing),
    [store.selection]
  );

  const addPadding = (direction) => {
    EventEmitter.emit('add padding', {
      direction,
      settings: {
        color: store.color,
        labels: store.labels,
        strokeOffset: store.strokeOffset,
        labelsOutside: store.labelsOutside,
        labelPattern: store.labelPattern,
      },
    });
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

        <Lines selection={store.selection.length} hasSpacing={hasSpacing}>
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
                active={store.surrounding.topPadding}
                onClick={() => addPadding(Alignments.TOP)}
              />
              <Line.Vertical
                labels={store.labels}
                labelsOutside={store.labelsOutside}
                className="bottom"
                style={{ height: 26 }}
                active={store.surrounding.bottomPadding}
                onClick={() => addPadding(Alignments.BOTTOM)}
              />

              <OverlayRect
                className={`center ${store.fill}`}
                active={store.surrounding.center}
                onClick={() =>
                  store.setSurrounding({
                    ...store.surrounding,
                    center: !store.surrounding.center,
                  })
                }
              >
                <Line.Vertical
                  labels={store.labels}
                  labelsOutside={store.labelsOutside}
                  style={{ height: 29, left: 10, top: 1, zIndex: 15 }}
                  active={store.surrounding.verticalBar}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    store.setSurrounding({
                      ...store.surrounding,
                      verticalBar: !store.surrounding.verticalBar,
                    });
                  }}
                />
                <Line.Horizontal
                  labels={store.labels}
                  labelsOutside={store.labelsOutside}
                  style={{ width: 29, right: 0, top: -19, zIndex: 15 }}
                  active={store.surrounding.horizontalBar}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    store.setSurrounding({
                      ...store.surrounding,
                      horizontalBar: !store.surrounding.horizontalBar,
                    });
                  }}
                />
              </OverlayRect>

              <Line.Horizontal
                labels={store.labels}
                labelsOutside={store.labelsOutside}
                className="left"
                style={{ width: 26 }}
                active={store.surrounding.leftPadding}
                onClick={() => addPadding(Alignments.LEFT)}
              />
              <Line.Horizontal
                labels={store.labels}
                labelsOutside={store.labelsOutside}
                className="right"
                style={{ width: 26 }}
                active={store.surrounding.rightPadding}
                onClick={() => addPadding(Alignments.RIGHT)}
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

const OverlayRect = styled.div.attrs<{ active?: boolean }>((props) => ({
  className: props.active ? 'active' : '',
}))<{ active?: boolean }>`
  width: 45px;
  height: 45px;
  border: 7px solid transparent;
  margin: 3px;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
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
  &.active {
    &::before {
      border-color: ${(props) => props.theme.color};
    }
  }
  &.dashed {
    &::before {
      border-style: dashed;
    }
  }
  &.fill {
    background-color: ${(props) => props.theme.hoverColor};
    &::before {
      border-color: transparent;
    }
    &.active {
      background-color: ${(props) => props.theme.color};
      opacity: 0.5;
    }
  }
  &.fill-stroke  {
    background-color: ${(props) => props.theme.hoverColor};
  }
  &.fill-stroke,
  &.fill  {
    &:hover {
      box-shadow: 0 0 0 3px ${(props) => props.theme.softColor};
    }
  }
  &.dashed,
  &.stroke {
    &:hover {
      border-color: ${(props) => props.theme.hoverColor};
    }
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
    width: 6px;
    height: 6px;
    border: 1px solid ${(props) => props.theme.softColor};
    border-radius: 1px;
    transform: rotate(45deg);
    z-index: -1;
  }
  &::after {
    width: 6px;
    height: 6px;
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
      left: 5px;
      bottom: -3px;
    }
    &::after {
      left: 6px;
      bottom: -2px;
    }
  }
  &[data-direction='BOTTOM'] {
    grid-area: bottom;
    &::before {
      left: 5px;
      top: -3px;
    }
    &::after {
      left: 6px;
      top: -2px;
    }
  }
  &[data-direction='LEFT'] {
    grid-area: left;
    &::before {
      right: -3px;
      top: 5px;
    }
    &::after {
      right: -2px;
      top: 6px;
    }
  }
  &[data-direction='RIGHT'] {
    grid-area: right;
    &::before {
      top: 5px;
      left: -3px;
    }
    &::after {
      top: 6px;
      left: -2px;
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

const Lines = styled.div<{ selection: number; hasSpacing: boolean }>`
  grid-area: center;
  display: grid;
  grid-template-rows: 21px 1fr 21px;
  grid-template-columns: 21px 1fr 21px;
  height: 100%;
  transition: height 0.3s, width 0.3s;
  width: ${(p) => (p.selection === 2 || p.hasSpacing ? 171 : 145)}px;
  height: ${(p) => (p.selection === 2 || p.hasSpacing ? 171 : 145)}px;
  margin: 0 auto;
  > div {
    position: relative;
    align-self: center;
    justify-self: center;
  }
`;

const Wrapper = styled.div`
  /* width: 145px;
  height: 145px; */
  .custom-tooltip {
    color: #fff !important;
    background-color: #000 !important;
    padding: 10px;
  }
`;

export default Viewer;
