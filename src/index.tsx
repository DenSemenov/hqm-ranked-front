import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { store } from './stores';
import { onMessageListener, requestForToken } from './firebase';

const container = document.getElementById('root')!;
const root = createRoot(container);

onMessageListener()
  .then((payload) => {
    console.log(payload)
  })
  .catch((err) => console.log('failed: ', err));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();