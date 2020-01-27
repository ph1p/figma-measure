import React, {
  FunctionComponent,
  useState,
  createRef,
  useEffect
} from 'react';
import select from '../figma-ui/select.js';
import { sendMessage } from '../utils';

const Presets: FunctionComponent = () => {
  const capSelect = createRef<HTMLSelectElement>();
  const [hasSelections, setHasSelections] = useState<boolean>(false);
  // const [lineOffset, setLineOffset] = useState<number>(3);

  const setLine = (direction, align) => {
    if (hasSelections) {
      sendMessage('line', {
        direction,
        align,
        strokeCap: (capSelect.current as any).value
      });
    }
  };

  const setPreset = direction => {
    if (hasSelections) {
      sendMessage('line-preset', {
        direction,
        strokeCap: (capSelect.current as any).value
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

  useEffect(() => {
    // init select field style
    select.init();

    // check selection
    sendMessage('selection');

    window.onmessage = event => {
      if (event.data.pluginMessage.type === 'selection') {
        setHasSelections(event.data.pluginMessage.data);
      }
    };

    return () => select.destroy();
  }, []);

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
            onClick={() => setLine('horizontal', 'TOP')}
          />
          <div
            className="align-icon horizontal"
            onClick={() => setLine('horizontal', 'CENTER')}
          />
          <div
            className="align-icon horizontal bottom"
            onClick={() => setLine('horizontal', 'BOTTOM')}
          />

          <div
            className="align-icon vertical left"
            onClick={() => setLine('vertical', 'LEFT')}
          />
          <div
            className="align-icon vertical"
            onClick={() => setLine('vertical', 'CENTER')}
          />
          <div
            className="align-icon vertical right"
            onClick={() => setLine('vertical', 'RIGHT')}
          />
        </div>
      </div>
      <div className="content">
        <h4>Presets</h4>
        <div className="grid">
          <div
            className="align-icon left-bottom"
            onClick={() => setPreset('left-bottom')}
          />
          <div
            className="align-icon left-top"
            onClick={() => setPreset('left-top')}
          />
          <div
            className="align-icon right-bottom"
            onClick={() => setPreset('right-bottom')}
          />
          <div
            className="align-icon right-top"
            onClick={() => setPreset('right-top')}
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
            ref={capSelect}
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
};

export default Presets;
