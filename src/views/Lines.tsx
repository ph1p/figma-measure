import React, { FunctionComponent, useState, useEffect } from 'react';
import { sendMessage, withAppContext, Content, Grid } from '../shared';
import Header from '../components/Header';
import Select from '../components/Select';

const Lines: FunctionComponent = (props: any) => {
  const [cap, setCap] = useState<string>('STANDARD');
  // const [lineOffset, setLineOffset] = useState<number>(3);

  useEffect(() => {
    sendMessage('resize', {
      width: 155,
      height: 380
    });
  }, []);

  const setLine = (direction, align) => {
    if (props.appData.selection) {
      sendMessage('line', {
        direction,
        align,
        strokeCap: cap
      });
    }
  };

  const setPreset = direction => {
    if (props.appData.selection) {
      sendMessage('line-preset', {
        direction,
        strokeCap: cap
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

  return (
    <>
      <Header backButton title="Presets" />
      {/* <label className="checkbox">
          <div className="checkbox__container">
            <input type="checkbox" className="checkbox__box" />
            <span className="checkbox__mark" />
          </div>
          <div className="checkbox__label">Width</div>
        </label> */}

      <Content>
        <h4>Alignments</h4>
        <Grid>
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
        </Grid>
      </Content>
      <Content>
        <h4>Presets</h4>
        <Grid>
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
        </Grid>
      </Content>

      <hr />

      <Content>
        <h4>Cap</h4>

        <Select
          value={cap}
          values={{
            STANDARD: 'Standard',
            NONE: 'None',
            ARROW_LINES: 'Line Arrow',
            ARROW_EQUILATERAL: 'Triangle Arrow'
          }}
          onChange={value => setCap(value)}
        />
      </Content>
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
    </>
  );
};

export default withAppContext(Lines);
