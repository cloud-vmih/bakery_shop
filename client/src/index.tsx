import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Toaster } from "react-hot-toast";
import './index.css'; // nếu muốn CSS global

// Tìm element root trong public/index.html
const root = createRoot(
  document.getElementById('root') as HTMLElement
);

// Render App
root.render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center" />
  </React.StrictMode>
);



