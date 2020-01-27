import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MemoryRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './figma-ui/main.min.css';
import './ui.css';
import Home from './views/Home';
import Tooltip from './views/Tooltip';
import Angle from './views/Angle';
import Presets from './views/Presets';


// // const isNumberValid = (num: any): boolean => /^-?[0-9]\d*?$/g.test(num);

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
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

        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/tooltip" exact>
            <Tooltip />
          </Route>
          <Route path="/angle" exact>
            <Angle />
          </Route>
          <Route path="/presets" exact>
            <Presets />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
