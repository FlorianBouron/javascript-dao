import React from 'react';
import ReactDOM from 'react-dom';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import App from './components/pages/App/App';
import reportWebVitals from './reportWebVitals';
import './index.css';

// 4 = Rinkeby.
const supportedChainIds = [4];

// We support Metamask which is an "injected wallet".
const connectors = {
  injected: {},
};

ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <App />
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
