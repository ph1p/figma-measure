import { useEffect, useImperativeHandle, useRef, useState } from 'preact/hooks';
import React, { RefAttributes } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';

interface Props {
  handler?: React.ForwardRefExoticComponent<RefAttributes<HTMLElement>>;
  hover?: boolean;
  children: unknown;
  style?: unknown;
  offsetHorizontal?: number;
  placement?: 'top' | 'bottom';
  padding?: number;
  borderRadius?: number;
}

const Tooltip = React.forwardRef<HTMLElement, Props>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handler: HandlerComp } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const handlerRef = useRef<HTMLElement>(null);

  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(handlerRef.current, popperElement, {
    placement: props.placement || 'top',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowElement,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, props.padding || (props.hover ? 10 : 15)],
        },
      },
      {
        name: 'preventOverflow',
        options: {
          padding: props.offsetHorizontal || 10,
        },
      },
    ],
  });

  useImperativeHandle(ref, () => ({
    hide: () => setIsOpen(false),
  }));

  useEffect(() => {
    if (!props.hover) {
      const handleClick = (event) => {
        if (!wrapperRef.current?.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef}>
      <div
        onClick={() => !props.hover && setIsOpen(!isOpen)}
        onMouseEnter={() => props.hover && setIsOpen(!isOpen)}
        onMouseLeave={() => props.hover && setIsOpen(!isOpen)}
      >
        <HandlerComp ref={handlerRef} />
      </div>

      {isOpen && (
        <Wrapper
          isOpen={isOpen}
          hover={props.hover}
          ref={setPopperElement}
          style={styles.popper}
          borderRadius={props.borderRadius}
          {...attributes.popper}
        >
          <TooltipContent
            padding={props.padding}
            hover={props.hover}
            style={props.style}
          >
            {props.children}
          </TooltipContent>
          <Arrow
            ref={setArrowElement}
            hover={props.hover}
            style={styles.arrow}
          />
        </Wrapper>
      )}
    </div>
  );
});

const TooltipContent = styled.div<{ hover: boolean; padding?: number }>`
  padding: ${(p) => p.padding || (p.hover ? '5px 10px' : 15)};
  position: relative;
  z-index: 1;
  font-weight: normal;
`;

const Arrow = styled.div<{ hover: boolean }>`
  position: absolute;
  width: 21px;
  height: 21px;
  pointer-events: none;
  &::before {
    content: '';
    position: absolute;
    width: 21px;
    height: 21px;
    background-color: #000;
    transform: rotate(45deg);
    top: 0px;
    left: 0px;
    border-radius: 2px;
    z-index: -1;
  }
`;

const Wrapper = styled.div<{
  hover: boolean;
  isOpen: boolean;
  borderRadius?: number;
}>`
  position: fixed;
  background-color: #000;
  border-radius: ${(p) => p.borderRadius || (p.hover ? 3 : 4)}px;
  visibility: ${(p) => (p.isOpen ? 'visible' : 'hidden')};
  pointer-events: ${(p) => (p.isOpen ? 'all' : 'none')};
  z-index: 99;
  color: #fff;
  font-weight: bold;

  &-enter {
    opacity: 0;
  }
  &-enter-active {
    opacity: 1;
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
  &-exit {
    opacity: 1;
  }
  &-exit-active {
    opacity: 0;
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }

  &[data-popper-placement^='top'] {
    ${Arrow} {
      bottom: -1px;
    }
  }
  &[data-popper-placement^='bottom'] {
    ${Arrow} {
      top: -1px;
    }
  }
  &.place-left {
    &::after {
      margin-top: -10px;
    }
  }
`;

export default Tooltip;
