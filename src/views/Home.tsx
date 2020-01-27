import React, { FunctionComponent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { sendMessage, withAppContext, Content } from '../shared';

const Home: FunctionComponent = () => {
  useEffect(() => {
    sendMessage('resize', {
      width: 250,
      height: 400
    });
  }, []);

  return (
    <>
      <Header title="Home" />
      <Content>
        <nav>
          <ul>
            <li>
              <Link to="/tooltip">Tooltip</Link>
            </li>
            <li>
              <Link to="/angle">Angle</Link>
            </li>
            <li>
              <Link to="/presets">Presets</Link>
            </li>
          </ul>
        </nav>
      </Content>
    </>
  );
};

export default withAppContext(Home);
