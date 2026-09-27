import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept benign HTMLMediaElement interruption rejections (play interrupted by pause or DOM removal)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = (reason && (reason.message || reason.toString())) || '';
    const name = reason && reason.name;
    if (
      name === 'AbortError' ||
      name === 'NotAllowedError' ||
      msg.includes('interrupted by a call to pause') ||
      msg.includes('interrupted because the media was removed') ||
      msg.includes('interrupted') ||
      msg.includes('play()') ||
      msg.includes('pause()')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
