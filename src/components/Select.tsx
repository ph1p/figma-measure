import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 100%;
  cursor: default;
  select {
    display: none;
  }
`;

const Select: FunctionComponent<{
  values: { [k: string]: string };
  value: string;
  onChange: (value: string) => void;
}> = (props: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(
    props.value || Object.keys(props.values)[0]
  );

  useEffect(() => {
    setOpen(false);
    props.onChange(selected);
  }, [selected]);

  return (
    <SelectWrapper>
      <button className="select-menu__button" onClick={() => setOpen(!open)}>
        <span className="select-menu__button-label">
          {props.values[selected]}
        </span>
        <span className="select-menu__icon"></span>
      </button>
      <ul
        className={`select-menu__list ${open && 'select-menu__list--active'}`}
      >
        {Object.entries(props.values).map(([value, key]) => (
          <li
            key={key as string}
            className={`select-menu__list-item ${
              value === selected ? 'select-menu__list-item--active' : ''
            }`}
            data-value={value}
            onClick={() => setSelected(value)}
          >
            <span className="select-menu__list-item-icon"></span>
            <span className="select-menu__list-item-text">{key}</span>
          </li>
        ))}
      </ul>
    </SelectWrapper>
  );
};

export default Select;
