# Byldur - AI-Powered Website Builder (React Version)

This is the React implementation of the Byldur website builder application. It provides a modern, component-based architecture with improved maintainability and user experience.

## Features

- AI-powered website building using Claude API
- Website editor based on GrapesJS
- User authentication system
- Project creation and management
- Subscription system with Stripe integration
- Credit system for AI usage
- Responsive design

## Technology Stack

- **Frontend:**
  - React 18 with functional components and hooks
  - React Router for navigation
  - Context API for state management
  - Styled Components for styling
  - GrapesJS for website builder
  
- **Backend:**
  - Node.js with Express
  - PostgreSQL with Sequelize ORM
  - JWT authentication
  - Stripe for payment processing
  - Claude API for AI text generation

## Project Structure

```
app/
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── common/        # Shared UI components
│   │   ├── editor/        # Website editor components
│   │   ├── layouts/       # Layout components
│   │   └── navigation/    # Navigation components
│   ├── contexts/          # React Context API providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   ├── styles/            # Global styles
│   ├── utils/             # Utility functions
│   ├── App.js             # Main App component
│   └── index.js           # Application entry point
├── package.json           # Dependencies and scripts
└── README.md              # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/username/byldur.git
   cd byldur
   ```

2. Install backend dependencies:
   ```
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../app
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `server` directory based on the provided `.env.example`
   - Ensure all required API keys are correctly set up for Stripe, Claude AI, etc.

5. Start the development server:
   ```
   # Start the backend API server (from server directory)
   npm run dev
   
   # In a new terminal, start the React frontend (from app directory)
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Development

### Backend API Server

The backend API runs on port 5000 by default. It serves as a RESTful API for the React frontend.

### Frontend Development

The React development server includes hot-reloading and will automatically proxy API requests to the backend server.

## Deployment

### Production Build

1. Create a production build of the React app:
   ```
   cd app
   npm run build
   ```

2. The built files will be in the `app/build` directory, which can be served by the Express backend.

3. Configure the backend to serve the React build files in production:
   ```javascript
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../app/build')));
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../app/build', 'index.html'));
     });
   }
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [GrapesJS](https://grapesjs.com/) - Web Builder Framework
- [Anthropic Claude](https://www.anthropic.com/claude) - AI Assistant API
- [Stripe](https://stripe.com/) - Payment Processing
- [React](https://reactjs.org/) - UI Library
- [Express](https://expressjs.com/) - Backend Framework 