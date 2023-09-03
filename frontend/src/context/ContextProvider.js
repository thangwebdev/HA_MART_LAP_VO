import React from 'react';
import { SnackbarProvider } from './snackbarContext.js/index.js';
import { SocketProvider } from './socketContext/index.js';
import GlobalThemProvider from './themeContext/index.js';
import ApisProvider from './apisContext/index.js';
import ConfirmProvider from './confirmContext/ConfirmProvider.js';

function ContextProvider({ children }) {
  return (
    <>
      <GlobalThemProvider>
        <SnackbarProvider>
          <ConfirmProvider>
            <ApisProvider>
              <SocketProvider>{children}</SocketProvider>
            </ApisProvider>
          </ConfirmProvider>
        </SnackbarProvider>
      </GlobalThemProvider>
    </>
  );
}

export default ContextProvider;
