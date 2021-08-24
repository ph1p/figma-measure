import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

// components
import {
  ColorIcon,
  CornerRadiusIcon,
  FontFamilyIcon,
  FontSizeIcon,
  HeightIcon,
  NameIcon,
  OpacityIcon,
  PointsIcon,
  StrokeIcon,
  WidthIcon,
} from '../../../components/icons/TooltipIcons';
import { useStore } from '../../../store';

export const PreviewTooltip: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <Tooltip>
      {store.tooltip.name && (
        <div>
          <div className="icon">
            <NameIcon />
          </div>
          <span>Rectangle 1</span>
        </div>
      )}
      {store.tooltip.fontName && (
        <div>
          <div className="icon">
            <FontFamilyIcon />
          </div>
          <FontFamily>
            <span>Inter</span>
            <p>
              Medium
              {store.tooltip.fontSize && (
                <>
                  <br />
                  Sizes: 12, 14
                </>
              )}
            </p>
          </FontFamily>
        </div>
      )}
      {store.tooltip.width && (
        <div>
          <div className="icon">
            <WidthIcon />
          </div>
          <span>200</span>
        </div>
      )}
      {store.tooltip.height && (
        <div>
          <div className="icon">
            <HeightIcon />
          </div>
          <span>100</span>
        </div>
      )}
      {store.tooltip.color && (
        <div>
          <div className="icon">
            <ColorIcon />
          </div>
          <span>#1745E8</span>
        </div>
      )}
      {store.tooltip.opacity && (
        <div>
          <div className="icon">
            <OpacityIcon />
          </div>
          <span>90%</span>
        </div>
      )}
      {store.tooltip.stroke && (
        <div>
          <div className="icon">
            <StrokeIcon />
          </div>
          <span>5</span>
        </div>
      )}
      {store.tooltip.cornerRadius && (
        <div>
          <div className="icon">
            <CornerRadiusIcon />
          </div>
          <span>7</span>
        </div>
      )}
      {store.tooltip.points && (
        <div>
          <div className="icon">
            <PointsIcon />
          </div>
          <span>4</span>
        </div>
      )}
    </Tooltip>
  );
});

const FontFamily = styled.div`
  p {
    color: #999;
    font-size: 10px;
    margin: 0;
  }
`;

const Tooltip = styled.div`
  padding: 12px;
  background-color: #fff;
  border-radius: 7px;
  width: 130px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    margin-top: -3px;
    top: 50%;
    right: -6px;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid #fff;
  }
  & > div {
    display: flex;
    margin-bottom: 6px;
    &:last-child {
      margin-bottom: 0;
    }
    .icon {
      margin-right: 12px;
    }
  }
`;
