import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // Certifica-te que o ficheiro é App.jsx com 'A' maiúsculo
import './index.css'   // Importação obrigatória para o Tailwind funcionar

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)