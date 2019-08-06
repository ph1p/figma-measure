import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './figma-ui/main.min.css';
import './ui.css';

declare function require(path: string): any;

class App extends React.Component {
  textbox: HTMLInputElement;

  onCreate = () => {
    parent.postMessage(
      {
        pluginMessage: { type: 'create' }
      },
      '*'
    );
  };

  onCancel = () => {
    parent.postMessage(
      {
        pluginMessage: { type: 'cancel' }
      },
      '*'
    );
  };

  componentDidMount() {
    require('./figma-ui/scripts.min.js');
  }

  render() {
    return (
      <div className="main">
        <label className="checkbox">
          <div className="checkbox__container">
            <input type="checkbox" className="checkbox__box" />
            <span className="checkbox__mark" />
          </div>
          <div className="checkbox__label">Width</div>
        </label>

        <div className="flex">
          <div className="align-icon horizontal" />
          <div className="align-icon horizontal top" />
          <div className="align-icon horizontal bottom" />
        </div>

        <label className="checkbox">
          <div className="checkbox__container">
            <input type="checkbox" className="checkbox__box" />
            <span className="checkbox__mark" />
          </div>
          <div className="checkbox__label">Height</div>
        </label>
        <div className="flex">
          <div className="align-icon vertical" />
          <div className="align-icon vertical left" />
          <div className="align-icon vertical right" />
        </div>

        <hr />

        <div className="footer">
          <label htmlFor="select-menu2">
            Cap
            <select name="" id="select-menu2" className="select-menu" required>
              <option value="NONE">None</option>
              <option value="ROUND">Round</option>
              <option value="SQUARE">Square</option>
              <option value="ARROW_LINES">Line Arrow</option>
              <option value="ARROW_EQUILATERAL">Triangle Arrow</option>
            </select>
          </label>

          <button
            className="button-mark button button--primary"
            onClick={this.onCreate}
          >
            Mark
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
