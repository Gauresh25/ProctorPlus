# Authentication Feature Context

## Overview

Custom JWT authentication system replacing Clerk in a Django-React exam portal. Built with:

- Backend: Django + DRF + SimpleJWT
- Frontend: React + Context API
- Database: PostgreSQL

## Core Functionality

1. **Registration Flow**

   - Email + Phone + Password signup
   - JWT token generation
   - Auto-login after registration

2. **Login System**

   - Email + Password authentication
   - Token-based session management
   - Protected route handling

3. **State Management**
   - Centralized AuthContext for auth state
   - Automatic token validation
   - Cross-component auth access

## Key Files

- `authentication/views.py`: Backend auth endpoints
- `authentication/models.py`: Custom User model
- `contexts/AuthContext.js`: Frontend auth state
- `App.jsx`: Root component with auth wrapping
- `AuthenticationPage.jsx`: Login/Register UI

## Development Notes

- Uses Vite for frontend tooling
- Token stored in localStorage
- Protected routes managed via context
- No serializers approach for simplicity
- CORS configured for local development

## Testing

Use Postman with endpoints:

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me (Protected)
```

## Common Operations

1. User auth status: `useAuth()` hook
2. Protect routes: `<ProtectedRoute>` wrapper
3. Access user data: `auth.user` via context
4. Logout: `auth.logout()` function

