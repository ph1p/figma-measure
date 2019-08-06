import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './figma-ui/main.min.css';
import './ui.css';

declare function require(path: string): any;

class App extends React.Component {
  capSelect = React.createRef<HTMLSelectElement>();

  onCancel = () => {
    parent.postMessage(
      {
        pluginMessage: { type: 'cancel' }
      },
      '*'
    );
  };

  sendMessage = (action = '', options) => {
    parent.postMessage(
      {
        pluginMessage: {
          options,
          action: 'line'
        }
      },
      '*'
    );
  };

  setLine = (direction, align) => {
    this.sendMessage('line', {
      direction,
      align,
      strokeCap: this.capSelect.current.value
    });
  };

  componentDidMount() {
    require('./figma-ui/scripts.min.js');
  }

  render() {
    return (
      <div className="main">
        {/* <label className="checkbox">
          <div className="checkbox__container">
            <input type="checkbox" className="checkbox__box" />
            <span className="checkbox__mark" />
          </div>
          <div className="checkbox__label">Width</div>
        </label> */}

        <div className="content">
          <h4>Sizes</h4>
          <div className="grid">
            <div
              className="align-icon horizontal top"
              onClick={() => this.setLine('horizontal', 'TOP')}
            />
            <div
              className="align-icon horizontal"
              onClick={() => this.setLine('horizontal', 'CENTER')}
            />
            <div
              className="align-icon horizontal bottom"
              onClick={() => this.setLine('horizontal', 'BOTTOM')}
            />


            <div
              className="align-icon vertical left"
              onClick={() => this.setLine('vertical', 'LEFT')}
            />
            <div
              className="align-icon vertical"
              onClick={() => this.setLine('vertical', 'CENTER')}
            />
            <div
              className="align-icon vertical right"
              onClick={() => this.setLine('vertical', 'RIGHT')}
            />
          </div>
        </div>

        <hr />

        <div className="footer">
          <label htmlFor="select-cap">
            <h4>Cap</h4>
            <select id="select-cap" ref={this.capSelect} className="select-menu" required>
              <option value="STANDARD">Standard</option>
              <option value="NONE">None</option>
              <option value="ARROW_LINES">Line Arrow</option>
              <option value="ARROW_EQUILATERAL">Triangle Arrow</option>
            </select>
          </label>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
