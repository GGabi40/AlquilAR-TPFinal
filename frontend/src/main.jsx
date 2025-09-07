import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "bootswatch/dist/minty/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './bootstrap.css';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
