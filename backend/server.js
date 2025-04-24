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
    ? ['https://uet-mit-instruments-checklist.vercel.app', 
       'https://uet-mit-instruments-checklist-frontend.vercel.app',
       'https://frontend-git-main-shadracks-projects-a6bc7ac0.vercel.app'] 
    : true, // Allow any origin in development
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

// Root route for API health check
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Test route to check if API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Debug routes information
app.get('/api/debug', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach(middleware => {
    if(middleware.route){
      // Routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if(middleware.name === 'router'){
      // Router middleware
      middleware.handle.stack.forEach(handler => {
        if(handler.route){
          const path = handler.route.path;
          routes.push({
            path: '/api' + path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  res.json({
    routes,
    apiRoutesLoaded: typeof apiRoutes === 'function',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`Server is definitely running on http://localhost:${PORT}`);
    console.log(`Try accessing http://localhost:${PORT}/api/test in your browser`);
  });

  // Handle server errors
  server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Try a different port.`);
    }
  });
}

// Export the Express API for Vercel
module.exports = app;