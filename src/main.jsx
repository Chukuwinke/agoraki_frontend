import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
      type="v3"
    >
      <App />
    </GoogleReCaptchaProvider>
)
