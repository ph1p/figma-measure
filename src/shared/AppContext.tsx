import React, { FunctionComponent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TOOLTIP_DEFAULT_SETTINGS, TooltipSettings } from '../shared';

const AppContext = React.createContext(null);

export interface AppContextProps {
  selection?: [];
  tooltipSettings?: TooltipSettings;
  setSelection?: (selection) => void;
  setTooltipSettings?: (settings) => void;
}

export const AppProvider: FunctionComponent<AppContextProps> = props => {
  function setSelection(selection) {
    setState({
      ...state,
      selection
    });
  }

  function setTooltipSettings(settings) {
    setTooltipState({
      ...tooltipState,
      ...settings
    });
  }

  const [tooltipState, setTooltipState] = useState(TOOLTIP_DEFAULT_SETTINGS);
  const [state, setState] = useState({
    setTooltipSettings,
    setSelection,
    selection: []
  });

  return (
    <AppContext.Provider
      value={{
        tooltipSettings: tooltipState,
        ...state
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const withAppContext = <Comp extends React.ComponentType<any>>(
  Component: Comp
): React.ComponentClass<any> => {
  return class ComponentWithSocket extends React.Component<any> {
    static propTypes = {
      Component: PropTypes.element
    };

    static displayName = `${Component.displayName || Component.name}`;

    render() {
      return (
        <AppContext.Consumer>
          {data => <Component {...(this.props as any)} appData={data} />}
        </AppContext.Consumer>
      );
    }
  };
};
