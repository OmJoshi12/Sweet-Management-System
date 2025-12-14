const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const sweetsRoutes = require('./routes/sweets');
const imagesRoutes = require('./routes/images');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static assets
app.use('/static', express.static(path.join(__dirname, '..', 'assets')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);
app.use('/api/images', imagesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
