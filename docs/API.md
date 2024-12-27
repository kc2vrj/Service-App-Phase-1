# API Documentation

This document describes the API endpoints available in the Timesheet Application.

## Authentication

All API endpoints require authentication using Firebase Authentication. Include the authentication token in the Authorization header:

```
Authorization: Bearer your-firebase-token
```

## Endpoints

### User Synchronization

#### `POST /api/sync-workspace-users`

Synchronizes users between Google Workspace and the application.

**Required Role:** ADMIN or SUPER_ADMIN

**Request:**
- Method: POST
- Headers:
  - Authorization: Bearer token
- Body: Empty

**Response:**
```json
{
  "success": true,
  "details": {
    "added": 0,
    "updated": 0,
    "removed": 0,
    "errors": 0,
    "skipped": 0
  }
}
```

### Error Responses

All endpoints may return the following error responses:

- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient privileges
- 500 Internal Server Error: Server-side error

## Rate Limiting

API endpoints are rate-limited to prevent abuse. Limits are configured per endpoint and may vary based on user role.

## Best Practices

1. Always validate response status codes
2. Implement proper error handling
3. Use appropriate HTTP methods
4. Cache responses when appropriate
5. Handle rate limiting gracefully
