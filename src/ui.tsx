import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './figma-ui/main.min.css';
import './ui.css';

declare function require(path: string): any;

// const isNumberValid = (num: any): boolean => /^-?[0-9]\d*?$/g.test(num);

const sendMessage = (action, options = {}) => {
  parent.postMessage(
    {
      pluginMessage: {
        options,
        action
      }
    },
    '*'
  );
};

class App extends React.Component<
  {},
  { hasSelections: boolean; lineOffset: number }
> {
  capSelect = React.createRef<HTMLSelectElement>();

  constructor(props) {
    super(props);

    this.state = {
      hasSelections: false,
      lineOffset: 3
    };
  }

  setLine = (direction, align) => {
    if (this.state.hasSelections) {
      sendMessage('line', {
        direction,
        align,
        strokeCap: (this.capSelect.current as any).value
      });
    }
  };

  setPreset = direction => {
    if (this.state.hasSelections) {
      sendMessage('line-preset', {
        direction,
        strokeCap: (this.capSelect.current as any).value
      });
    }
  };

  // changeOffset = e => {
  //   const { value } = e.target;

  //   this.setState({
  //     lineOffset: value
  //   });

  //   if (isNumberValid(value)) {
  //     sendMessage('line-offset', {
  //       value
  //     });
  //   }
  // };

  componentDidMount() {
    require('./figma-ui/scripts.min.js');

    window.onmessage = event => {
      if (event.data.pluginMessage.type === 'selection') {
        this.setState({
          hasSelections: event.data.pluginMessage.data
        });
      }
    };
  }

  render() {
    const { hasSelections } = this.state;
    return (
      <div className={`main ${hasSelections ? 'selections' : ''}`}>
        {/* <label className="checkbox">
          <div className="checkbox__container">
            <input type="checkbox" className="checkbox__box" />
            <span className="checkbox__mark" />
          </div>
          <div className="checkbox__label">Width</div>
        </label> */}

        <div className="content">
          <h4>Alignments</h4>
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
        <div className="content">
          <h4>Presets</h4>
          <div className="grid">
            <div
              className="align-icon left-bottom"
              onClick={() => this.setPreset('left-bottom')}
            />
            <div
              className="align-icon left-top"
              onClick={() => this.setPreset('left-top')}
            />
            <div
              className="align-icon right-bottom"
              onClick={() => this.setPreset('right-bottom')}
            />
            <div
              className="align-icon right-top"
              onClick={() => this.setPreset('right-top')}
            />
          </div>
        </div>
        <div className="content">
          <h4>Angle</h4>
          <div
            className="align-icon angle"
            onClick={() => sendMessage('angle')}
          />
        </div>

        <div className="content">
          <h4>Tooltip</h4>
          <div
            className="align-icon tooltip"
            onClick={() => sendMessage('tooltip')}
          />
        </div>

        <hr />

        <div className="content">
          <label htmlFor="select-cap">
            <h4>Cap</h4>
            <select
              id="select-cap"
              ref={this.capSelect}
              className="select-menu"
              required
            >
              <option value="STANDARD">Standard</option>
              <option value="NONE">None</option>
              <option value="ARROW_LINES">Line Arrow</option>
              <option value="ARROW_EQUILATERAL">Triangle Arrow</option>
            </select>
          </label>
        </div>
        {/* <hr /> */}

        {/* <div className="content">
          <label htmlFor="line-offset-input">
            <h4>Offset</h4>
            <div className="input-icon">
              <div className="input-icon__icon">
                <div className="icon icon--adjust icon--black-3" />
              </div>
              <input
                name="line-offset-input"
                onChange={e => this.changeOffset(e)}
                value={this.state.lineOffset}
                placeholder="Value"
                className={`input-icon__input ${
                  !isNumberValid(this.state.lineOffset) ? 'error' : ''
                }`}
              />
            </div>
          </label>
        </div> */}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
