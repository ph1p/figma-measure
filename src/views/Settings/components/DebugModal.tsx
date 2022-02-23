import { observer } from 'mobx-react';
import { useEffect, useMemo, useState } from 'preact/hooks';
import React, { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import EventEmitter from '../../../shared/EventEmitter';

export const DebugModal: FunctionComponent<{ close: () => void }> = observer(
  (props) => {
    const [isLoading, setLoading] = useState(true);
    const [activeNodeId, setActiveNodeId] = useState('');
    const [measurements, setMeasurements] = useState([]);

    const groupedByPage = useMemo(() => {
      const pages = {};

      for (const measurement of measurements) {
        if (!measurement.type.startsWith('GROUP_')) {
          if (!pages[measurement.pageId]) {
            pages[measurement.pageId] = {
              name: measurement.pageName,
              measurements: [],
            };
          }
          pages[measurement.pageId].measurements.push(measurement);
        }
      }

      return pages;
    }, [measurements]);

    useEffect(() => {
      EventEmitter.ask('file measurements').then((data: any[]) => {
        setMeasurements(data);
        setLoading(false);
      });
    }, []);

    return (
      <>
        <DebugOverlay onClick={props.close} />
        <DebugWrapper>
          <DebugClose onClick={props.close}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="https://www.w3.org/2000/svg"
            >
              <path
                d="M13.4099 12.0002L19.7099 5.71019C19.8982 5.52188 20.004 5.26649 20.004 5.00019C20.004 4.73388 19.8982 4.47849 19.7099 4.29019C19.5216 4.10188 19.2662 3.99609 18.9999 3.99609C18.7336 3.99609 18.4782 4.10188 18.2899 4.29019L11.9999 10.5902L5.70994 4.29019C5.52164 4.10188 5.26624 3.99609 4.99994 3.99609C4.73364 3.99609 4.47824 4.10188 4.28994 4.29019C4.10164 4.47849 3.99585 4.73388 3.99585 5.00019C3.99585 5.26649 4.10164 5.52188 4.28994 5.71019L10.5899 12.0002L4.28994 18.2902C4.19621 18.3831 4.12182 18.4937 4.07105 18.6156C4.02028 18.7375 3.99414 18.8682 3.99414 19.0002C3.99414 19.1322 4.02028 19.2629 4.07105 19.3848C4.12182 19.5066 4.19621 19.6172 4.28994 19.7102C4.3829 19.8039 4.4935 19.8783 4.61536 19.9291C4.73722 19.9798 4.86793 20.006 4.99994 20.006C5.13195 20.006 5.26266 19.9798 5.38452 19.9291C5.50638 19.8783 5.61698 19.8039 5.70994 19.7102L11.9999 13.4102L18.2899 19.7102C18.3829 19.8039 18.4935 19.8783 18.6154 19.9291C18.7372 19.9798 18.8679 20.006 18.9999 20.006C19.132 20.006 19.2627 19.9798 19.3845 19.9291C19.5064 19.8783 19.617 19.8039 19.7099 19.7102C19.8037 19.6172 19.8781 19.5066 19.9288 19.3848C19.9796 19.2629 20.0057 19.1322 20.0057 19.0002C20.0057 18.8682 19.9796 18.7375 19.9288 18.6156C19.8781 18.4937 19.8037 18.3831 19.7099 18.2902L13.4099 12.0002Z"
                fill="black"
              />
            </svg>
          </DebugClose>
          <Headline>All measurements</Headline>
          <DebugList>
            <p>
              Listed elements still have Measure data. You can delete them here,
              but normally this is not necessary!
            </p>
            {isLoading && (
              <div className="loading">
                loading elements ...
                <br />
                (this could take a while)
              </div>
            )}
            {!isLoading && Object.keys(groupedByPage).length === 0 && (
              <div className="empty">No elements found</div>
            )}
            {measurements.length > 0 && (
              <ul>
                {Object.keys(groupedByPage).map((pageId) => (
                  <div className="page">
                    <h4>{groupedByPage[pageId].name}</h4>
                    {groupedByPage[pageId].measurements.map((element) => (
                      <li>
                        <span>{element.name}</span>
                        <div>
                          <FocusButton
                            onClick={() => {
                              setActiveNodeId(
                                element.id === activeNodeId ? '' : element.id
                              );
                              EventEmitter.emit('focus node', element);
                            }}
                          >
                            focus
                          </FocusButton>

                          <RemoveButton
                            onClick={() => {
                              const tempMeasurements = measurements.filter(
                                (m) =>
                                  m.pageId === pageId && m.id !== element.id
                              );

                              setMeasurements(tempMeasurements);

                              EventEmitter.emit(
                                'remove node measurement',
                                element.id
                              );
                            }}
                          >
                            remove
                          </RemoveButton>
                        </div>
                      </li>
                    ))}
                  </div>
                ))}
              </ul>
            )}
          </DebugList>
        </DebugWrapper>
      </>
    );
  }
);

const Button = styled.button`
  display: inline-block;
  border: 0px;
  padding: 4px 7px;
  font-size: 11px;
  border-radius: 4px;
  text-align: center;
  color: #fff;
`;

const RemoveButton = styled(Button)`
  background-color: #444;
`;

const FocusButton = styled(Button)`
  margin-right: 7px;
  background-color: #c85555;
`;

const Headline = styled.h3`
  font-size: 13px;
  font-weight: 500;
  margin: 14px 14px 0;
`;

const DebugClose = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  cursor: pointer;
`;

export const OverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 31;
  height: 100%;
  width: 100%;
`;

const DebugOverlay = styled.div`
  ${OverlayStyle}
`;

const DebugList = styled.div`
  padding: 14px;
  p {
    color: #999;
    margin: 0 0 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .loading,
  .empty {
    text-align: center;
  }
  .page {
    margin-bottom: 14px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      cursor: pointer;
      padding: 10px;
      font-size: 11px;
      background-color: #eee;
      border-radius: 5px;
      margin-bottom: 7px;
      span {
        display: block;
        margin-bottom: 5px;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const DebugWrapper = styled.div`
  position: fixed;
  background-color: #fff;
  top: 14px;
  left: 14px;
  right: 14px;
  max-height: 60%;
  z-index: 32;
  font-size: 11px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  overflow: auto;
`;
