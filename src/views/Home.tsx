import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { sendMessage, withAppContext } from '../shared';
import { Icon, Button } from '../components/ui';

const Info = styled.nav`
padding: 10px;
color: #999;
`;

const Nav = styled.nav`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      cursor: pointer;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      border-top: 1px solid #ddd;
      &:hover {
        background-color: #f3f3f3;
      }
    }
  }
`;

const Home: FunctionComponent = () => {
  const history = useHistory();

  useEffect(() => {
    sendMessage('resize', {
      width: 200,
      height: 150
    });
  }, []);

  return (
    <>
      <Info>Select one of the following sections </Info>
      <Nav>
        <ul>
          <li onClick={() => history.push('/tooltip')}>
            <Icon icon="component" />
            Tooltip
          </li>
          <li onClick={() => history.push('/angle')}>
            <Icon icon="angle" />
            Angle
          </li>
          <li onClick={() => history.push('/lines')}>
            <Icon icon="frame" />
            Lines
          </li>
        </ul>
      </Nav>
    </>
  );
};

export default withAppContext(Home);
