import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './app/App';
import { store } from './app/store';
import './index.css';

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.warn('Service worker registration failed', error);
    }
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

void registerServiceWorker();
