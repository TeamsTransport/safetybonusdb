import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // ← This must exist and import Tailwind

export default function App() {
  return (
    <div className="p-4 text-center text-xl text-blue-600">
      Hello from Tailwind + React + Vite!
    </div>
  );
}

