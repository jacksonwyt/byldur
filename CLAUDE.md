# Byldur Development Guide

## Commands
- Server: `cd server && npm start` (production), `cd server && npm run dev` (development)
- App: `cd app && npm start` (development), `cd app && npm run build` (production)
- Testing: `cd app && npm test` (all tests), `cd app && npm test -- -t 'test name'` (single test)
- Linting: `cd app && npm run lint` (check), `cd app && npm run lint:fix` (auto-fix)

## Code Style
- Components: Functional React with hooks (no classes)
- Import order: External libraries → Internal contexts/hooks → Components → Utils
- Naming: PascalCase for components, camelCase for functions/variables/hooks
- Error handling: Try/catch in async functions, ErrorBoundary for React components
- API calls: Use custom hooks (useApi, useAuthApi, useProjectApi)
- Testing: Use renderWithProviders from test-utils.js for component tests

## Project Structure
- Components organized by domain (common, editor, layouts, etc.)
- Context providers with factory pattern using custom hooks
- Separate API service modules for different domains