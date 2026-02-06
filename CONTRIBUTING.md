# Contributing to Onfleet Active Tasks Manager

Thank you for your interest in contributing to this project!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm run install:all`
3. Start development servers: `npm run dev`

## Project Structure

```
├── backend/          # Express API server
│   ├── server.js    # Main server file with API routes
│   └── package.json
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API service layer
│   │   └── store/       # Zustand state management
│   └── package.json
└── package.json      # Root package for running both servers
```

## Development Workflow

1. **Backend Development**
   - The backend runs on port 3001 by default
   - All routes are prefixed with `/api`
   - CORS is enabled for local development

2. **Frontend Development**
   - The frontend runs on port 5173 (Vite default)
   - Hot module replacement is enabled
   - API calls are proxied to the backend

3. **Testing Changes**
   - You'll need a valid Onfleet API key to test the application
   - Enter your API key in the frontend to test data fetching
   - Check the browser console and terminal for errors

## Code Style

- Use consistent formatting
- Follow existing code patterns
- Add comments for complex logic
- Keep components focused and reusable

## Submitting Changes

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request with a clear description

## Questions?

Open an issue for any questions or concerns!
