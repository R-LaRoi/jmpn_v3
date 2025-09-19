import axios from 'axios';

// Configure axios to always include credentials
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)