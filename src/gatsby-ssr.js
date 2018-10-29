import React from 'react';
import { JssProvider, SheetsRegistry } from 'react-jss';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  createGenerateClassName,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';

const defaultOptions = {
  theme: {},
  dangerouslyUseGlobalCSS: false,
  productionPrefix: 'jss',
};

const sheetsRegistryMap = new Map();

export const wrapRootElement = ({ element, pathname }, options) => {
  const { dangerouslyUseGlobalCSS, productionPrefix, theme } = {
    ...defaultOptions,
    ...options,
  };

  const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS,
    productionPrefix,
  });

  const key = pathname || 'NO_PATHNAME';
  const sheetsRegistry = new SheetsRegistry();
  sheetsRegistryMap.set(key, sheetsRegistry);

  return (
    <JssProvider
      registry={sheetsRegistry}
      generateClassName={generateClassName}
    >
      <MuiThemeProvider theme={createMuiTheme(theme)} sheetsManager={new Map()}>
        <CssBaseline />
        {element}
      </MuiThemeProvider>
    </JssProvider>
  );
};

export const onRenderBody = ({ setHeadComponents, pathname }) => {
  const key = pathname || 'NO_PATHNAME';
  const sheetsRegistry = sheetsRegistryMap.get(key);

  if (sheetsRegistry) {
    setHeadComponents([
      <style
        type="text/css"
        id="server-side-jss"
        key="server-side-jss"
        dangerouslySetInnerHTML={{ __html: sheetsRegistry.toString() }}
      />,
    ]);

    sheetsRegistryMap.delete(key);
  }
};
