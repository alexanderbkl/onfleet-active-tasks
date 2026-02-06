# Security Recommendations & Best Practices

This document provides actionable security recommendations based on the security audit performed on February 6, 2026.

## Quick Wins - Implement Immediately

### 1. Add API Key Storage Warning to UI

**File:** `frontend/src/components/ApiKeyInput.jsx`

Add a security notice to inform users about localStorage:

```jsx
export const ApiKeyInput = () => {
  // ... existing code ...

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Onfleet API Key</h2>
      
      {/* ADD THIS WARNING */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Security Notice:</strong> Your API key is stored in your browser's local storage. 
              Clear it when using shared computers. Never share your API key.
            </p>
          </div>
        </div>
      </div>
      
      {/* ... rest of existing code ... */}
    </div>
  );
};
```

### 2. Add Auto-Expiration for API Key

**File:** `frontend/src/store/useStore.js`

Implement automatic API key expiration:

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// API key expires after 24 hours of inactivity
const API_KEY_EXPIRY_MS = 24 * 60 * 60 * 1000;

export const useStore = create(
  persist(
    (set, get) => ({
      apiKey: '',
      apiKeyTimestamp: null,
      
      setApiKey: (key) => set({ 
        apiKey: key,
        apiKeyTimestamp: Date.now()
      }),
      
      clearApiKey: () => set({ 
        apiKey: '',
        apiKeyTimestamp: null
      }),
      
      // Check if API key is expired
      isApiKeyExpired: () => {
        const { apiKeyTimestamp } = get();
        if (!apiKeyTimestamp) return true;
        return Date.now() - apiKeyTimestamp > API_KEY_EXPIRY_MS;
      },
      
      // Get API key only if not expired
      getValidApiKey: () => {
        const { apiKey, isApiKeyExpired, clearApiKey } = get();
        if (isApiKeyExpired()) {
          clearApiKey();
          return '';
        }
        return apiKey;
      }
    }),
    {
      name: 'onfleet-storage',
    }
  )
);
```

Then update components to use `getValidApiKey()` instead of `apiKey`.

### 3. Restrict CORS Origins

**File:** `backend/server.js`

Add environment-specific CORS configuration:

```javascript
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://yourdomain.com'
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

// ... rest of code
```

Update `.env.example`:

```env
# Backend Configuration
PORT=3001
NODE_ENV=development

# Frontend Configuration  
VITE_API_URL=http://localhost:3001/api

# Production CORS (Set in production)
# FRONTEND_URL=https://yourdomain.com
```

---

## Medium Priority - Production Hardening

### 4. Sanitize Error Messages

Create an error handler middleware:

**File:** `backend/errorHandler.js` (new file)

```javascript
export const errorHandler = (error, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Log full error server-side
  console.error('Error:', error);
  
  // Determine status code
  const statusCode = error.response?.status || error.statusCode || 500;
  
  // Send sanitized response
  res.status(statusCode).json({
    error: error.message || 'An error occurred',
    // Only include detailed info in development
    ...(isDevelopment && {
      details: error.response?.data,
      stack: error.stack
    })
  });
};
```

Update `backend/server.js`:

```javascript
import { errorHandler } from './errorHandler.js';

// ... existing routes ...

// Add error handler at the end (before app.listen)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 5. Add Rate Limiting

Install rate limiting middleware:

```bash
cd backend
npm install express-rate-limit
```

**File:** `backend/server.js`

```javascript
import rateLimit from 'express-rate-limit';

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all API routes
app.use('/api/', limiter);
```

### 6. Add Content Security Policy

Install helmet for security headers:

```bash
cd backend
npm install helmet
```

**File:** `backend/server.js`

```javascript
import helmet from 'helmet';

// Add security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://onfleet.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

---

## Long-Term Improvements

### 7. Implement OAuth 2.0 Flow

Instead of direct API key input, implement a proper OAuth flow:

1. User clicks "Connect to Onfleet"
2. Redirected to Onfleet OAuth authorization page
3. User grants permission
4. Application receives access token
5. Token stored server-side in session

This requires Onfleet OAuth support. Check their documentation.

### 8. Server-Side Session Management

Move API key storage from client to server:

1. Store API keys in server-side sessions (Redis/Memcached)
2. Client only stores session ID (httpOnly cookie)
3. API requests include session cookie
4. Server validates session and uses stored API key

### 9. Add Input Validation

Install validation library:

```bash
cd backend
npm install joi
```

Create validation schemas:

**File:** `backend/validators.js` (new file)

```javascript
import Joi from 'joi';

export const schemas = {
  apiKey: Joi.object({
    apiKey: Joi.string().required().min(32).max(128)
  }),
  
  workerTasks: Joi.object({
    apiKey: Joi.string().required(),
    includeTaskCounts: Joi.boolean().optional()
  }),
  
  tasks: Joi.object({
    apiKey: Joi.string().required(),
    from: Joi.number().optional(),
    to: Joi.number().optional()
  })
};

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.details 
      });
    }
    next();
  };
};
```

Use in routes:

```javascript
import { schemas, validate } from './validators.js';

app.post('/api/teams', validate(schemas.apiKey), async (req, res) => {
  // Route logic
});
```

### 10. Add Security Audit Automation

Create a GitHub Actions workflow:

**File:** `.github/workflows/security-audit.yml` (new file)

```yaml
name: Security Audit

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    # Run weekly on Monday at 00:00 UTC
    - cron: '0 0 * * 1'

jobs:
  audit:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Run npm audit (Backend)
      run: |
        cd backend
        npm ci
        npm audit --audit-level=moderate
    
    - name: Run npm audit (Frontend)
      run: |
        cd frontend
        npm ci
        npm audit --audit-level=moderate
    
    - name: Scan for secrets with git-secrets
      run: |
        git clone https://github.com/awslabs/git-secrets.git
        cd git-secrets
        sudo make install
        cd ..
        git secrets --install
        git secrets --register-aws
        git secrets --scan-history
```

---

## Security Checklist for Production Deployment

Before deploying to production, ensure:

- [ ] CORS configured for specific origin (not `*`)
- [ ] HTTPS/TLS enabled
- [ ] Environment variables configured (not hardcoded)
- [ ] Error messages sanitized
- [ ] Rate limiting enabled
- [ ] Security headers (CSP, HSTS, etc.) configured
- [ ] API key expiration implemented
- [ ] Input validation on all endpoints
- [ ] Logging and monitoring set up
- [ ] Regular security audits scheduled
- [ ] Dependency updates automated (Dependabot)
- [ ] API key rotation policy defined
- [ ] Incident response plan documented

---

## Security Monitoring

### Set Up Alerts

1. **GitHub Dependabot**
   - Enable in repository settings
   - Auto-creates PRs for security updates

2. **npm Audit**
   - Run `npm audit` before each release
   - Fix vulnerabilities before deployment

3. **Snyk Integration** (Optional)
   - Continuous vulnerability scanning
   - Real-time alerts for new CVEs

### Regular Audits

- **Weekly:** Run `npm audit` in all packages
- **Monthly:** Review access logs for anomalies  
- **Quarterly:** Full security audit (like this one)
- **Yearly:** Third-party security assessment

---

## Developer Security Guidelines

### For Code Reviews

1. Check for hardcoded credentials
2. Verify sensitive data is not logged
3. Ensure user input is validated
4. Confirm error messages are sanitized
5. Review new dependencies for security issues

### For Commits

1. Never commit `.env` files
2. Use `.gitignore` for sensitive files
3. Review diffs before pushing
4. Use signed commits (GPG)
5. Write descriptive commit messages

### For Dependencies

1. Pin versions in `package.json`
2. Review changelogs before updating
3. Check for known vulnerabilities
4. Prefer well-maintained packages
5. Audit licenses for compliance

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Security Best Practices](https://react.dev/reference/react-dom/server)
- [Onfleet API Security](https://docs.onfleet.com/)

---

**Last Updated:** February 6, 2026  
**Next Review:** May 6, 2026 (Quarterly)
