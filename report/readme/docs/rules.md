# Authorization Rules

## General Rules

- All authenticated users can view public information
- Admin users have full access to all endpoints
- Users can only modify their own resources
- Authentication is handled via JWT tokens

## Specific Endpoints

### Cats

- GET /api/cats - Public access
- POST /api/cats - Authenticated users only
- GET /api/cats/:id - Public access
- PUT /api/cats/:id - Only cat owner or admin
- DELETE /api/cats/:id - Only cat owner or admin

### Users

- GET /api/users - Authenticated users only
- POST /api/users - Public access (registration)
- GET /api/users/:id - Public access
- PUT /api/users/:id - Only the user themselves or admin
- DELETE /api/users/:id - Only the user themselves or admin
- GET /api/users/:id/cats - Only the user themselves or admin

## Role-based Access

- Admin: Full access to all endpoints
- Regular User: Can manage their own resources
- Unauthenticated: Can only access public endpoints
