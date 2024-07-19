import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store.tsx';
import App from './App.tsx';
import './index.css';


const container:HTMLDivElement | any = document.getElementById('root');
const root = createRoot(container);

root.render(
  ///<React.StrictMode>
    <Provider store={store}>

      <App />

      </Provider>
  
  
  ///</React.StrictMode>
);


