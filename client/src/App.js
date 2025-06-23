import React, { useState } from 'react';
import Calculator from './components/Calculator';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <h1>Scientific Calculator</h1>
      <Calculator />
    </div>
  );
}

export default App;