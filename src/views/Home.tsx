import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { sendMessage, withAppContext } from '../shared';
import { Icon } from '../components/ui';
import pkg from '../../package.json';

const Home: FunctionComponent = () => {
  const history = useHistory();

  useEffect(() => {
    sendMessage('resize', {
      width: 200,
      height: 172
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
      <Version>
        <a
          target="_blank"
          href="https://github.com/ph1p/figma-measure/releases"
        >
          v{pkg.version}
        </a>
      </Version>
    </>
  );
};

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
      &:last-child {
        border-bottom: 1px solid #ddd;
      }
      &:hover {
        background-color: #f3f3f3;
      }
    }
  }
`;

const Version = styled.div`
  text-align: center;
  padding: 5px 8px;
  a {
    color: #999;
    text-decoration: none;
    font-size: 10px;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default withAppContext(Home);
