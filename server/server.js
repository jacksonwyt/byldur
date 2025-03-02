// Updated server/server.js
const express = require('express');
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
const session = require('express-session');

// Load Sequelize database connection
const sequelize = require('./config/database');

// Load models
const { Project, User, AIUsage, AICredit, Subscription } = require('./models');

dotenv.config();

const app = express();

// Set up request logging
app.use(morgan('dev'));

// Trust proxy - configure properly for environment
// In development, avoid the trust proxy setting entirely
if (process.env.NODE_ENV === 'production') {
  // In production, use more specific trust proxy settings
  app.set('trust proxy', 'loopback, linklocal, uniquelocal');
}

// Set up session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'byldur-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Set up body parsing
app.use(bodyParser.json());
app.use(cookieParser());

// Handle Stripe webhook with raw body
app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }));

// Set up CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Add compression
app.use(compression());

// Add caching middleware for certain routes
const cache = apicache.middleware;

// Add rate limiting with trusted proxies configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip X-Forwarded-For validation in development to avoid the error
  validateIpAddress: process.env.NODE_ENV === 'production',
});

// Apply stricter rate limiting to AI routes
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 AI requests per windowMs
  message: 'Too many AI requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip X-Forwarded-For validation in development to avoid the error
  validateIpAddress: process.env.NODE_ENV === 'production',
});

// Apply rate limiting to all API requests
app.use('/api/', apiLimiter);
app.use('/api/ai/', aiLimiter);

// Add security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://js.stripe.com", "https://unpkg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.anthropic.com", "https://api.stripe.com", "https://api.github.com"]
    }
  }
}));

// Add request sanitization
app.use(xss());

// PostgreSQL connection
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL successfully');
    return sequelize.sync(); // { force: true } to recreate tables, be careful in production!
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
  });

// Import route files
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const aiRoutes = require('./routes/ai');
const subscriptionRoutes = require('./routes/subscriptions');
const githubRoutes = require('./routes/github'); // New GitHub routes
const templateRoutes = require('./routes/templates'); // New Template routes

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/github', githubRoutes); // Add GitHub routes
app.use('/api/templates', templateRoutes); // Add Template routes

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

// Migration: Add redirects from old HTML pages to new React routes
const redirectMap = {
  '/index.html': '/',
  '/login.html': '/login',
  '/dashboard.html': '/dashboard',
  '/editor.html': '/editor',
  '/landing.html': '/',
  '/subscription.html': '/subscription'
};

// Serve static assets from the React app in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../app/build')));

  // All remaining requests return the React app, so it can handle routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/build', 'index.html'));
  });
} else {
  // In development, we'll redirect to the React dev server
  app.get('*', (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3001');
  });
}

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
    sequelize.close().then(() => {
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

// Set the port
const port = 5001;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));