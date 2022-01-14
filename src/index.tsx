import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { env } from 'process';
env.MY_CUSTOM_ENV_ID = "lalavany";
env.ID = "e3f8f682-bc70-4cb3-9691-9cf96be18d9a";
env.KEY = "92634b4ca55113af3e36c1ab70550261";
env.ORDERER =
  "https://alfred.southeastasia.fluidrelay.azure.com";
env.STORAGE =
  "https://historian.southeastasia.fluidrelay.azure.com";
  
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
