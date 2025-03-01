const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const apicache = require('apicache');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const morgan = require('morgan');
const compression = require('compression');

// Load models
const Project = require('./models/Project');
const User = require('./models/User');
const AIUsage = require('./models/AIUsage');
const AICredit = require('./models/AICredit');
const Subscription = require('./models/Subscription');

dotenv.config();

const app = express();

// Set up request logging
app.use(morgan('dev'));

// Set up body parsing
app.use(bodyParser.json());
app.use(cookieParser());

// Handle Stripe webhook with raw body
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

// Set up static file serving
app.use(express.static(path.join(__dirname, '../public')));

// Set up CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Add compression
app.use(compression());

// Add caching middleware for certain routes
const cache = apicache.middleware;

// Add rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

// Apply stricter rate limiting to AI routes
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 AI requests per windowMs
  message: 'Too many AI requests, please try again later'
});

// Apply rate limiting to all API requests
app.use('/api/', apiLimiter);
app.use('/api/ai/', aiLimiter);

// Add security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      connectSrc: ["'self'", "https://api.anthropic.com", "https://api.stripe.com"]
    }
  }
}));

// Add request sanitization
app.use(xss());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Trying to connect to local MongoDB instance...');
    mongoose.connect('mongodb://localhost:27017/byldur-website-builder')
      .then(() => console.log('Connected to local MongoDB successfully'))
      .catch(localErr => console.error('Local MongoDB connection error:', localErr));
  });

// Import route files
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const aiRoutes = require('./routes/ai');
const subscriptionRoutes = require('./routes/subscriptions');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Cache public project routes
app.get('/api/public/projects/:id', cache('1 hour'), async (req, res) => {
  try {
    const project = await Project.getPublicProject(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found or not public' });
    }
    
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// For any other API route not found
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve the SPA for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Implement graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Received shutdown signal, closing server...');
  
  // Close server
  server.close(() => {
    console.log('Server closed');
    
    // Close database connection
    mongoose.connection.close(false, () => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
  
  // Force close after 30 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 30000);
}

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));