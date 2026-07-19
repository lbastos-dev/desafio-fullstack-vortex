import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css' // CSS do Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css' // Ícones do Bootstrap
import App from './App.jsx'
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// REGISTRO DO SERVICE WORKER (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('PWA: Service Worker registrado com sucesso sob o escopo: ', registration.scope);
      })
      .catch((error) => {
        console.error('PWA: Falha ao registrar o Service Worker: ', error);
      });
  });
}
