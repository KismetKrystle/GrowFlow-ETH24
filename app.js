import React from 'react';
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const App = () => (
  <DynamicContextProvider
    settings={{
      environmentId: '55c3bce0-3ba3-4c2f-a5b5-381cfbcfeefb',
      walletConnectors: [EthereumWalletConnectors],
    }}>
    <DynamicWidget />
  </DynamicContextProvider>
);

export default App;
