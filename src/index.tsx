import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { store } from './stores';
import { onMessageListener } from './firebase';
import { notification } from 'antd';

const container = document.getElementById('root')!;
const root = createRoot(container);

onMessageListener()
  .then((payload: any) => {
    notification.info({
      message: payload?.notification?.title,
      description: payload?.notification?.body
    })
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