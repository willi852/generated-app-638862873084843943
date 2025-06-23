const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Dynamic CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://*.vercel.app', process.env.FRONTEND_URL]
    : ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));

// Calculator routes
app.post('/api/calculate', (req, res) => {
  try {
    const { expression } = req.body;
    
    if (!expression) {
      return res.status(400).json({ error: 'Expression is required' });
    }

    // Basic validation for security
    if (!/^[0-9+\-*/.()^%!°√πeEsin costan logln ]+$/i.test(expression)) {
      return res.status(400).json({ error: 'Invalid characters in expression' });
    }

    // In a real app, use a proper math evaluation library like math.js
    // This is just a simple example
    const result = Function(`'use strict'; return (${expression})`)();
    
    res.json({ result });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(400).json({ error: 'Invalid mathematical expression' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});