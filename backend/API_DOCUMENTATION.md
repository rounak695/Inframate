# Inframate API Documentation

## Overview
The Inframate API is documented using Swagger/OpenAPI 3.0. Interactive documentation is available at `/api/docs` when running in development mode.

## Accessing API Documentation

### Local Development
```
http://localhost:3000/api/docs
```

### Staging/Production
Swagger is disabled in production by default for security. To enable:
```bash
ENABLE_SWAGGER=true
```

## Authentication

### Bearer Token (JWT)
Most endpoints require JWT authentication. To use protected endpoints:

1. **Login** via `POST /api/v1/auth/login`
2. Copy the `accessToken` from the response
3. In Swagger UI: Click **"Authorize"** button (top right)
4. Enter: `Bearer <your-token-here>`
5. Click **"Authorize"**, then **"Close"**

### Example Login Request
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.edu",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@demo.edu",
    "role": "ADMIN"
  }
}
```

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/login` | User login | No |
| POST | `/api/v1/auth/register` | User registration | No |

### Issues
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/issues` | List all issues | Yes |
| POST | `/api/v1/issues` | Create new issue | Yes |
| GET | `/api/v1/issues/:id` | Get issue details | Yes |
| PATCH | `/api/v1/issues/:id` | Update issue | Yes (Staff/Admin) |
| PATCH | `/api/v1/issues/:id/assign` | Assign issue | Yes (Admin) |
| PATCH | `/api/v1/issues/:id/status` | Update status | Yes (Staff/Admin) |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users` | List all users | Yes (Admin) |
| GET | `/api/v1/users/:id` | Get user details | Yes |

### Categories
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/categories` | List all categories | Yes |

### Analytics
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/analytics/overview` | Get overview stats | Yes (Admin) |
| GET | `/api/v1/analytics/metrics` | Get resolution metrics | Yes (Admin) |
| GET | `/api/v1/analytics/staff` | Get staff performance | Yes (Admin) |

### Audit
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/audit` | Get audit logs | Yes (Admin) |

## Exporting to Postman

### Method 1: Swagger UI Export
1. Navigate to `http://localhost:3000/api/docs`
2. Copy the full URL
3. Open Postman → **Import** → **Link**
4. Paste: `http://localhost:3000/api/docs-json`
5. Click **Continue** → **Import**

### Method 2: Manual JSON Download
```bash
# Download OpenAPI JSON
curl http://localhost:3000/api/docs-json > inframate-api.json

# Import inframate-api.json to Postman
```

### Setting Up Postman Environment
1. Create new environment: **Inframate Local**
2. Add variables:
   - `baseUrl`: `http://localhost:3000/api/v1`
   - `token`: (paste JWT token after login)
3. In request headers, use: `Authorization: Bearer {{token}}`

## Example Requests

### Create Issue
```bash
curl -X POST http://localhost:3000/api/v1/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Broken projector in Room 301",
    "description": "The projector in lecture hall 301 is not turning on",
    "categoryId": "category-uuid-here",
    "priority": "HIGH",
    "location": "Building A, Room 301"
  }'
```

### Get Analytics
```bash
curl -X GET "http://localhost:3000/api/v1/analytics/overview?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Response Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

## Rate Limiting
- **Limit**: 100 requests per minute per IP
- **Response**: 429 Too Many Requests
- **Header**: `Retry-After` (seconds until reset)

## Security Best Practices
1. Never commit API tokens to version control
2. Use environment variables for sensitive data
3. Always use HTTPS in production
4. Rotate JWT secrets regularly
5. Implement proper RBAC (already done via guards)

## Support
For issues or questions about the API, contact the development team or refer to the main project README.
