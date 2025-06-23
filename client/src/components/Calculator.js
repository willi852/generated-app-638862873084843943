import React, { useState } from 'react';
import axios from 'axios';
import * as math from 'mathjs';
import './../styles/App.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value) => {
    setInput(prev => prev + value);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleCalculate = () => {
    if (!input) return;
    
    try {
      // Client-side calculation for instant feedback
      const clientResult = math.evaluate(input);
      setResult(clientResult);

      // Send to server for validation
      axios.post(`${API_URL}/calculate`, { expression: input })
        .catch(error => {
          console.error('Server error:', error);
          // Continue with client result but show warning
          setResult(`${clientResult} (local calculation)`);
        });
    } catch (error) {
      setResult('Error: Invalid expression');
    }
  };

  const scientificButtons = [
    'sin(', 'cos(', 'tan(', '√(', 'log(', 'ln(', 
    'π', 'e', '^', '!', '(', ')', '°'
  ];

  return (
    <div className="calculator">
      <div className="display">{input}</div>
      <div className="result">{result}</div>
      
      <div className="buttons">
        <div className="grid-container">
          {/* Standard buttons */}
          {[7, 8, 9, '/', 4, 5, 6, '*', 1, 2, 3, '-', 0, '.', '=', '+'].map((num) => (
            <button 
              key={num} 
              onClick={num === '=' ? handleCalculate : () => handleButtonClick(num)}
            >
              {num}
            </button>
          ))}
          
          {/* Clear button */}
          <button onClick={handleClear}>C</button>

          {/* Scientific buttons */}
          {scientificButtons.map((func) => (
            <button key={func} onClick={() => handleButtonClick(func)}>
              {func}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;