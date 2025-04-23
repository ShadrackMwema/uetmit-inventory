const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://uet-mit-instruments-checklist.vercel.app', 'https://uet-mit-instruments-checklist-frontend.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/instruments_checklist';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', apiRoutes);

// For Vercel, export the Express app
if (process.env.NODE_ENV === 'production') {
  // Handle SPA routing for frontend - if used in same deployment
  app.get('*', (req, res) => {
    res.status(404).send('API endpoint not found');
  });
}

// Start the server if not in production (Vercel handles this in production)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;