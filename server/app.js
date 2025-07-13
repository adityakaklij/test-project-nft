const express = require('express');
const cors = require('cors');
const products = require('./data');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Debug route to test API
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Routes
app.get('/api/products', (req, res) => {
  console.log('Request received for /api/products');
  res.json(products);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

module.exports = app; 