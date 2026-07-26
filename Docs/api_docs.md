---
title: Multi-Tenant Ticketing System API Documentation
version: 1.0.0
status: Draft
api_version: v1
base_url: /api/v1
---

# API Documentation

## Document Information

| Property       | Value                         |
| -------------- | ----------------------------- |
| Document       | API Documentation             |
| System         | Multi-Tenant Ticketing System |
| Version        | 1.0                           |
| API Version    | v1                            |
| Architecture   | REST                          |
| Format         | JSON                          |
| Authentication | JWT Access + Refresh Token    |
| Transport      | HTTPS                         |
| Encoding       | UTF-8                         |

---

# 1. Introduction

This document defines the REST API contract for the Multi-Tenant Ticketing System.

It serves as the implementation contract between frontend, backend, QA, and third-party integrations.

The API follows RESTful design principles with predictable resource naming, standardized response structures, secure authentication, and tenant isolation.

---

# 2. Design Principles

The API follows the following principles.

## RESTful Resources

Resources are represented using nouns.

Examples:

```
/tickets
/projects
/clients
/users
```

---

## Stateless

Every request contains sufficient authentication information.

No server-side session state is maintained.

---

## JSON Only

Requests

```
Content-Type: application/json
```

Responses

```
application/json
```

---

## HTTPS Only

Production deployments must reject plain HTTP.

---

## Predictable URLs

Good

```
GET /tickets

GET /tickets/{ticketId}
```

Bad

```
GET /getTicket

POST /fetchTicket
```

---

## Idempotency

GET

Safe

PUT

Idempotent

DELETE

Soft Archive (not strictly idempotent: a second DELETE on an already-archived resource returns 404)

POST

Not idempotent

PATCH

Partial Update

---

# 3. Base URL

Development

```
http://localhost:3000/api/v1
```

Staging

```
https://staging.example.com/api/v1
```

Production

```
https://api.example.com/api/v1
```

---

# 4. API Versioning

The API uses URI versioning.

Example

```
/api/v1/tickets

/api/v1/projects
```

Breaking changes require a new API version.

```
/api/v2
```

---

# 5. Content Types

Requests

```
application/json
```

Multipart Uploads

```
multipart/form-data
```

Responses

```
application/json
```

---

# 6. Authentication

The API uses JWT authentication.

Two-token strategy:

- Access Token
- Refresh Token

### Login Flow

```
Login

↓

Access Token (15 minutes)

↓

Refresh Token (7 days)

↓

Refresh Endpoint

↓

New Access Token
```

---

## Authorization Header

```
Authorization: Bearer <access_token>
```

Missing or invalid tokens result in:

```
401 Unauthorized
```

---

# 7. User Roles

The API recognizes the following roles.

| Role           | Description                                            | Scope                                                  |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| Platform Admin | Manages the SaaS platform and all tenant organizations | Platform-level only; no access to tenant business data |
| Tenant Admin   | Full access within their tenant                        | Scoped to their tenant                                 |
| Engineer       | Assigned project and ticket operations                 | Scoped to their tenant and assigned projects           |
| Client         | Raises and tracks support tickets for their projects   | Scoped to their own client data                        |

Role checks are enforced on every protected endpoint.

> **Note:** Platform Admin endpoints are prefixed `/api/v1/admin/`. Client endpoints use the same base URL but resolve identity via `ClientPortalAccount`.

---

# 8. Tenant Isolation

Every authenticated request belongs to exactly one tenant.

The tenant is resolved from the authenticated user.

Clients cannot access data belonging to another tenant.

Every database query is automatically filtered by

```
tenant_id
```

Cross-tenant access returns

```
403 Forbidden
```

---

# 9. Standard Headers

## Request Headers

```
Authorization

Content-Type

Accept
```

Example

```
Authorization: Bearer eyJhb...
Content-Type: application/json
Accept: application/json
```

---

## Response Headers

```
Content-Type

X-Request-ID

Cache-Control
```

---

# 10. Standard Success Response

Every successful response follows the same format.

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

# 11. Standard Error Response

Every failed request returns a standardized error object.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required"
  }
}
```

---

# 12. HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |

---

# 13. Pagination

List endpoints support pagination.

Example

```
GET /tickets?page=1&limit=20
```

Default

```
20
```

Maximum

```
100
```

Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 125,
    "totalPages": 7
  }
}
```

---

# 14. Sorting

Supported using

```
sortBy

order
```

Example

```
GET /tickets?sortBy=createdAt&order=desc
```

---

# 15. Filtering

Example

```
GET /tickets

?status=OPEN

&priority=HIGH

&assignedTo=userId
```

Multiple filters may be combined.

---

# 16. Searching

Full-text search is supported.

```
GET /tickets?search=database error
```

Searchable fields:

- Ticket Title
- Ticket Number
- Description

---

# 17. Rate Limiting

Default limits

Anonymous

```
60 requests/minute
```

Authenticated

```
300 requests/minute
```

Authentication endpoints

```
10 requests/minute
```

Exceeding limits returns

```
429 Too Many Requests
```

---

# 18. Request Lifecycle

```
Client

↓

Authentication

↓

Authorization

↓

Tenant Resolution

↓

Validation

↓

Business Logic

↓

Database

↓

Audit Log

↓

Response
```

---

# 19. Error Codes

| Code               | Meaning                 |
| ------------------ | ----------------------- |
| VALIDATION_ERROR   | Invalid request         |
| UNAUTHORIZED       | Authentication failed   |
| FORBIDDEN          | Permission denied       |
| NOT_FOUND          | Resource missing        |
| DUPLICATE_RESOURCE | Resource already exists |
| SLA_BREACHED       | SLA exceeded            |
| INTERNAL_ERROR     | Unexpected error        |

---

# 20. API Modules

The API is organized into the following modules.

1. Authentication

2. Users

3. Clients

4. Projects

5. Project SLA (managed under Project endpoints)

6. Tickets

7. Comments

8. Attachments

9. Notifications

10. Dashboard

11. Audit Logs

---

End of Foundation Section

# 5. Tenant Management APIs

Tenant Management APIs are available exclusively to Platform Administrators.

All endpoints are prefixed with `/api/v1/admin/`.

---

## 5.1 List Tenants

### Endpoint

```http
GET /api/v1/admin/tenants
```

### Authorization

Platform Admin

### Query Parameters

| Parameter | Description        |
| --------- | ------------------ |
| page      | Page number        |
| limit     | Records per page   |
| status    | ACTIVE / SUSPENDED |
| search    | Tenant name        |

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "ABC Technologies",
      "slug": "abc-technologies",
      "email": "admin@abc.com",
      "status": "ACTIVE"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 12 }
}
```

---

## 5.2 Get Tenant

### Endpoint

```http
GET /api/v1/admin/tenants/{tenantId}
```

### Authorization

Platform Admin

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "ABC Technologies",
    "slug": "abc-technologies",
    "email": "admin@abc.com",
    "phone": "+91XXXXXXXXXX",
    "status": "ACTIVE",
    "createdAt": "2026-07-01T00:00:00Z"
  }
}
```

---

## 5.3 Create Tenant

### Endpoint

```http
POST /api/v1/admin/tenants
```

### Authorization

Platform Admin

### Request

```json
{
  "name": "ABC Technologies",
  "email": "admin@abc.com",
  "phone": "+91XXXXXXXXXX"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Tenant created successfully",
  "data": { "id": "uuid", "slug": "abc-technologies" }
}
```

### Business Rules

- Name must be unique across the platform.
- Slug auto-generated from name.
- Audit log entry created.

---

## 5.4 Update Tenant

### Endpoint

```http
PATCH /api/v1/admin/tenants/{tenantId}
```

### Authorization

Platform Admin

### Request

```json
{
  "name": "ABC Technologies Ltd",
  "email": "support@abc.com"
}
```

---

## 5.5 Update Tenant Status

### Endpoint

```http
PATCH /api/v1/admin/tenants/{tenantId}/status
```

### Authorization

Platform Admin

### Request

```json
{
  "status": "SUSPENDED"
}
```

### Business Rules

- Suspended tenants cannot log in.
- Suspended tenant data is preserved.
- Audit log entry created.

---

## Tenant API Summary

| Method | Endpoint                         | Description             |
| ------ | -------------------------------- | ----------------------- |
| GET    | /admin/tenants                   | List tenants            |
| GET    | /admin/tenants/{tenantId}        | Get tenant              |
| POST   | /admin/tenants                   | Create tenant           |
| PATCH  | /admin/tenants/{tenantId}        | Update tenant           |
| PATCH  | /admin/tenants/{tenantId}/status | Suspend/activate tenant |

---

# 6. Authentication APIs

Authentication endpoints manage user login, session lifecycle, and password management.

---

## 6.1 Login

### Endpoint

```http
POST /api/v1/auth/login
```

### Description

Authenticates a user and returns access and refresh tokens.

### Authentication

Not Required

### Request

```json
{
  "email": "admin@example.com",
  "password": "Password@123"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "admin@example.com",
      "role": "TENANT_ADMIN"
    }
  }
}
```

### Errors

| Status | Description           |
| ------ | --------------------- |
| 400    | Invalid request       |
| 401    | Invalid credentials   |
| 423    | Account disabled      |
| 500    | Internal server error |

### Business Rules

- Email is case-insensitive.
- Passwords are compared using bcrypt/Argon2.
- Access token expires in 15 minutes.
- Refresh token expires in 7 days.
- Login event is recorded in Audit Log.

---

## 6.2 Refresh Token

### Endpoint

```http
POST /api/v1/auth/refresh
```

### Authentication

Refresh Token

### Request

```json
{
  "refreshToken": "<jwt>"
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    "accessToken": "<new-access-token>",
    "expiresIn": 900
  }
}
```

### Errors

- 401 Invalid refresh token
- 403 Refresh token revoked

### Business Rules

- Refresh tokens are rotated.
- Old refresh token becomes invalid.

---

## 6.3 Logout

### Endpoint

```http
POST /api/v1/auth/logout
```

### Authentication

Bearer Token

### Success Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Business Rules

- Refresh token revoked.
- Session invalidated.
- Audit log created.

---

## 6.4 Get Current User

### Endpoint

```http
GET /api/v1/auth/me
```

### Authentication

Bearer Token

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ENGINEER"
  }
}
```

---

## 6.5 Change Password

### Endpoint

```http
POST /api/v1/auth/change-password
```

### Authentication

Bearer Token

### Request

```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

### Business Rules

- Current password must match.
- New password must meet password policy.
- Existing refresh tokens are revoked.

---

## 6.6 Forgot Password

### Endpoint

```http
POST /api/v1/auth/forgot-password
```

### Authentication

Not Required

### Request

```json
{
  "email": "user@example.com"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "If that email is registered, a reset link has been sent."
}
```

### Business Rules

- Always returns 200 to prevent email enumeration.
- Token is hashed and stored in PasswordResetToken table.
- Token expires in 1 hour.
- Only one active token allowed per user.

---

## 6.7 Reset Password

### Endpoint

```http
POST /api/v1/auth/reset-password
```

### Authentication

Not Required

### Request

```json
{
  "token": "<reset-token>",
  "newPassword": "NewPassword@123"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Password reset successfully."
}
```

### Business Rules

- Token must be valid and unexpired.
- Token is single-use; marked used_at on consumption.
- All existing refresh tokens are revoked after reset.
- Audit log entry created.

---

## Authentication Summary

| Endpoint              | Method | Auth          |
| --------------------- | ------ | ------------- |
| /auth/login           | POST   | No            |
| /auth/refresh         | POST   | Refresh Token |
| /auth/logout          | POST   | Bearer        |
| /auth/me              | GET    | Bearer        |
| /auth/change-password | POST   | Bearer        |
| /auth/forgot-password | POST   | No            |
| /auth/reset-password  | POST   | No            |

# 7. User APIs

User APIs manage internal tenant users.

Roles supported:

- Tenant Admin
- Engineer

Only Tenant Admins can create, update, archive, or manage users.

---

## 7.1 List Users

### Endpoint

```http
GET /api/v1/users
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Query Parameters

| Parameter | Description          |
| --------- | -------------------- |
| page      | Page number          |
| limit     | Records per page     |
| search    | Search by name/email |
| role      | Filter by role       |
| status    | ACTIVE / INACTIVE    |

Example

```
GET /users?page=1&limit=20&role=ENGINEER
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ENGINEER",
      "status": "ACTIVE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
```

---

## 7.2 Get User

### Endpoint

```http
GET /api/v1/users/{userId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "ENGINEER",
    "status": "ACTIVE",
    "createdAt": "2026-07-23T12:00:00Z"
  }
}
```

### Errors

- 404 User not found
- 403 Cross-tenant access denied

---

## 7.3 Create User

### Endpoint

```http
POST /api/v1/users
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Request

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "role": "ENGINEER",
  "password": "Password@123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid"
  }
}
```

### Validation

- Email must be unique within the tenant.
- Password must meet the password policy.
- Role must be valid.

### Errors

- 400 Validation failed
- 409 Email already exists

---

## 7.4 Update User

### Endpoint

```http
PATCH /api/v1/users/{userId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Request

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "TENANT_ADMIN"
}
```

### Business Rules

- Email changes must remain unique.
- Users cannot modify another tenant's users.
- Role changes are recorded in the Audit Log.

---

## 7.5 Update User Status

### Endpoint

```http
PATCH /api/v1/users/{userId}/status
```

### Request

```json
{
  "status": "INACTIVE"
}
```

### Business Rules

- Inactive users cannot log in.
- Existing tickets remain assigned.
- Historical records are preserved.

---

## 7.6 Archive User

### Endpoint

```http
DELETE /api/v1/users/{userId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Description

Archives the user (soft delete).

### Success Response

```json
{
  "success": true,
  "message": "User archived successfully"
}
```

### Business Rules

- User is not permanently deleted.
- Related tickets remain unchanged.
- Sessions are revoked immediately.
- Audit log entry is created.

---

## User API Summary

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | /users                 | List users               |
| GET    | /users/{userId}        | Get user details         |
| POST   | /users                 | Create user              |
| PATCH  | /users/{userId}        | Update user              |
| PATCH  | /users/{userId}/status | Activate/Deactivate user |
| DELETE | /users/{userId}        | Archive user             |

# 8. Client APIs

Client APIs manage customer organizations for each tenant.

A Client represents a company receiving support services.

Only Tenant Admins can manage clients.

---

## 8.1 List Clients

### Endpoint

```http
GET /api/v1/clients
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Query Parameters

| Parameter | Description           |
| --------- | --------------------- |
| page      | Page number           |
| limit     | Records per page      |
| search    | Search by client name |
| status    | ACTIVE / INACTIVE     |

Example

```
GET /clients?page=1&limit=20&search=Acme
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corporation",
      "email": "contact@acme.com",
      "status": "ACTIVE",
      "projectCount": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 24
  }
}
```

---

## 8.2 Get Client

### Endpoint

```http
GET /api/v1/clients/{clientId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+91XXXXXXXXXX",
    "company": "Acme Corporation",
    "status": "ACTIVE",
    "createdAt": "2026-07-23T10:30:00Z"
  }
}
```

### Errors

- 404 Client not found
- 403 Cross-tenant access denied

---

## 8.3 Create Client

### Endpoint

```http
POST /api/v1/clients
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Request

```json
{
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+91XXXXXXXXXX",
  "company": "Acme Corporation"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "id": "uuid"
  }
}
```

### Validation

- Client name is required.
- Client name must be unique within the tenant.
- Email format must be valid.

### Errors

- 400 Validation failed
- 409 Client already exists

---

## 8.4 Update Client

### Endpoint

```http
PATCH /api/v1/clients/{clientId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Request

```json
{
  "name": "Acme Technologies",
  "phone": "+91YYYYYYYYYY",
  "status": "ACTIVE"
}
```

### Business Rules

- Archived clients cannot be updated.
- Duplicate client names are not allowed.
- Changes are recorded in the Audit Log.

---

## 8.5 Archive Client

### Endpoint

```http
DELETE /api/v1/clients/{clientId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Description

Soft archives the client.

### Success Response

```json
{
  "success": true,
  "message": "Client archived successfully"
}
```

### Business Rules

- Client is not permanently deleted.
- Existing projects remain for historical purposes.
- Archived clients cannot have new projects created.
- Audit log entry is created.

---

## 8.6 List Client Projects

### Endpoint

```http
GET /api/v1/clients/{clientId}/projects
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Website Revamp",
      "status": "ACTIVE",
      "ticketCount": 18
    },
    {
      "id": "uuid",
      "name": "Mobile App",
      "status": "ACTIVE",
      "ticketCount": 7
    }
  ]
}
```

### Errors

- 404 Client not found
- 403 Cross-tenant access denied

---

## Client API Summary

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| GET    | /clients                     | List clients         |
| GET    | /clients/{clientId}          | Get client details   |
| POST   | /clients                     | Create client        |
| PATCH  | /clients/{clientId}          | Update client        |
| DELETE | /clients/{clientId}          | Archive client       |
| GET    | /clients/{clientId}/projects | List client projects |

# 9. Project APIs

Project APIs manage software projects belonging to clients.

Each project belongs to exactly one client and one tenant.

Only Tenant Admins can create, update, or archive projects.

Engineers can view projects they are assigned to.

---

## 9.1 List Projects

### Endpoint

```http
GET /api/v1/projects
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Query Parameters

| Parameter | Description       |
| --------- | ----------------- |
| page      | Page number       |
| limit     | Records per page  |
| clientId  | Filter by client  |
| status    | ACTIVE / ARCHIVED |
| search    | Project name      |

Example

```
GET /projects?clientId=uuid&page=1&limit=20
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "CRM Platform",
      "clientName": "Acme Corporation",
      "status": "ACTIVE",
      "memberCount": 6,
      "ticketCount": 42
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15
  }
}
```

---

## 9.2 Get Project

### Endpoint

```http
GET /api/v1/projects/{projectId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "CRM Platform",
    "description": "Customer relationship management system",
    "status": "ACTIVE",
    "client": {
      "id": "uuid",
      "name": "Acme Corporation"
    },
    "memberCount": 6,
    "createdAt": "2026-07-23T10:00:00Z"
  }
}
```

### Errors

- 404 Project not found
- 403 Cross-tenant access denied

---

## 9.3 Create Project

### Endpoint

```http
POST /api/v1/projects
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Request

```json
{
  "clientId": "uuid",
  "name": "CRM Platform",
  "description": "Customer relationship management system"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "uuid"
  }
}
```

### Validation

- Client must exist.
- Client must belong to the tenant.
- Project name is required.
- Project name must be unique within the client.

---

## 9.4 Update Project

### Endpoint

```http
PATCH /api/v1/projects/{projectId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Request

```json
{
  "name": "CRM Platform V2",
  "description": "Updated project description",
  "status": "ACTIVE"
}
```

### Business Rules

- Archived projects cannot be updated.
- Client cannot be changed after project creation.
- Changes are recorded in the Audit Log.

---

## 9.5 Archive Project

### Endpoint

```http
DELETE /api/v1/projects/{projectId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Description

Soft archives the project.

### Success Response

```json
{
  "success": true,
  "message": "Project archived successfully"
}
```

### Business Rules

- Existing tickets remain available.
- Archived projects cannot receive new tickets.
- Historical data is preserved.

---

## 9.6 List Project Members

### Endpoint

```http
GET /api/v1/projects/{projectId}/members
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "role": "ENGINEER"
    }
  ]
}
```

---

## 9.7 Add Project Member

### Endpoint

```http
POST /api/v1/projects/{projectId}/members
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Request

```json
{
  "userId": "uuid"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Member added successfully"
}
```

### Business Rules

- User must belong to the same tenant.
- Duplicate assignments are not allowed.
- Assignment is recorded in the Audit Log.

---

## 9.8 Remove Project Member

### Endpoint

```http
DELETE /api/v1/projects/{projectId}/members/{userId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Success Response

```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

### Business Rules

- Member is removed only from the project.
- User account remains active.
- Existing ticket assignments remain unchanged.

---

## 9.9 Get Project SLA

### Endpoint

```http
GET /api/v1/projects/{projectId}/sla
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Success Response

```json
{
  "success": true,
  "data": {
    "responseTimeMinutes": 60,
    "resolutionTimeMinutes": 480,
    "businessHoursEnabled": true
  }
}
```

---

## 9.10 Update Project SLA

### Endpoint

```http
PATCH /api/v1/projects/{projectId}/sla
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Request

```json
{
  "responseTimeMinutes": 30,
  "resolutionTimeMinutes": 240,
  "businessHoursEnabled": true
}
```

### Business Rules

- Response time must be less than resolution time.
- SLA changes affect only future tickets.
- Changes are recorded in the Audit Log.

---

## Project API Summary

| Method | Endpoint                               | Description     |
| ------ | -------------------------------------- | --------------- |
| GET    | /projects                              | List projects   |
| GET    | /projects/{projectId}                  | Get project     |
| POST   | /projects                              | Create project  |
| PATCH  | /projects/{projectId}                  | Update project  |
| DELETE | /projects/{projectId}                  | Archive project |
| GET    | /projects/{projectId}/members          | List members    |
| POST   | /projects/{projectId}/members          | Add member      |
| DELETE | /projects/{projectId}/members/{userId} | Remove member   |
| GET    | /projects/{projectId}/sla              | Get SLA         |
| PATCH  | /projects/{projectId}/sla              | Update SLA      |

# 10. Ticket APIs

Ticket APIs manage the complete support ticket lifecycle.

Tickets belong to a Project and are scoped to a Tenant.

---

## 10.1 List Tickets

### Endpoint

```http
GET /api/v1/tickets
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Query Parameters

| Parameter  | Description            |
| ---------- | ---------------------- |
| page       | Page number            |
| limit      | Records per page       |
| projectId  | Filter by project      |
| clientId   | Filter by client       |
| status     | Ticket status          |
| priority   | Ticket priority        |
| assignedTo | Assigned engineer      |
| search     | Title or ticket number |

Example

```
GET /tickets?page=1&limit=20&status=OPEN&priority=HIGH
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "ticketNumber": "TKT-000124",
      "title": "Login issue",
      "status": "OPEN",
      "priority": "HIGH",
      "assignedTo": "John Doe",
      "project": "CRM Platform",
      "createdAt": "2026-07-23T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 126
  }
}
```

---

## 10.2 Get Ticket

### Endpoint

```http
GET /api/v1/tickets/{ticketId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "ticketNumber": "TKT-000124",
    "title": "Login issue",
    "description": "Users cannot login after deployment.",
    "status": "OPEN",
    "priority": "HIGH",
    "project": {
      "id": "uuid",
      "name": "CRM Platform"
    },
    "client": {
      "id": "uuid",
      "name": "Acme Corporation"
    },
    "assignedTo": {
      "id": "uuid",
      "name": "John Doe"
    }
  }
}
```

---

## 10.3 Create Ticket

### Endpoint

```http
POST /api/v1/tickets
```

### Authentication

Bearer Token

### Authorization

Client

> Clients are the only role authorized to create tickets. Tenant Admins and Engineers cannot create tickets on behalf of a client.

### Request

```json
{
  "projectId": "uuid",
  "title": "Unable to login",
  "description": "Login fails after deployment.",
  "priority": "HIGH"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "id": "uuid",
    "ticketNumber": "TKT-000125"
  }
}
```

### Business Rules

- Project must exist.
- Project must belong to tenant.
- Ticket number generated automatically.
- Default status is `OPEN`.

---

## 10.4 Update Ticket

### Endpoint

```http
PATCH /api/v1/tickets/{ticketId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Request

```json
{
  "title": "Unable to login after deployment",
  "description": "Updated description"
}
```

### Business Rules

- Closed tickets cannot be edited.
- All updates are recorded in Ticket History.

---

## 10.5 Update Ticket Status

### Endpoint

```http
PATCH /api/v1/tickets/{ticketId}/status
```

### Request

```json
{
  "status": "IN_PROGRESS"
}
```

### Allowed Status Flow

```
OPEN
↓

IN_PROGRESS
↓

RESOLVED
↓

CLOSED
```

### Business Rules

- Invalid transitions are rejected.
- Status changes create Ticket History entries.
- Closing a ticket records `closed_at`.

---

## 10.6 Update Ticket Priority

### Endpoint

```http
PATCH /api/v1/tickets/{ticketId}/priority
```

### Request

```json
{
  "priority": "CRITICAL"
}
```

### Business Rules

- Only Tenant Admin can change priority.
- Priority changes are audited.

---

## 10.7 Assign Ticket

### Endpoint

```http
PATCH /api/v1/tickets/{ticketId}/assign
```

### Request

```json
{
  "userId": "uuid"
}
```

### Business Rules

- Engineer must belong to the project.
- Assignment creates Assignment History.
- Notification sent to assigned engineer.

---

## 10.8 Reopen Ticket

### Endpoint

```http
POST /api/v1/tickets/{ticketId}/reopen
```

### Business Rules

- Only resolved or closed tickets can be reopened.
- Status becomes `IN_PROGRESS`.
- Reopen event recorded in Ticket History.

---

## 10.9 Archive Ticket

### Endpoint

```http
DELETE /api/v1/tickets/{ticketId}
```

### Description

Soft archives the ticket.

### Business Rules

- Historical records remain intact.
- Archived tickets are excluded from active lists.

---

## 10.10 Get Ticket History

### Endpoint

```http
GET /api/v1/tickets/{ticketId}/history
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "action": "STATUS_CHANGED",
      "oldValue": "OPEN",
      "newValue": "IN_PROGRESS",
      "performedBy": "John Doe",
      "createdAt": "2026-07-23T12:00:00Z"
    }
  ]
}
```

---

## 10.11 Get Assigned Tickets

### Endpoint

```http
GET /api/v1/tickets/my
```

### Authentication

Bearer Token

### Authorization

Engineer

### Description

Returns tickets assigned to the authenticated engineer.

---

## 10.12 Ticket Summary

### Endpoint

```http
GET /api/v1/tickets/summary
```

### Description

Returns ticket statistics for dashboards.

### Success Response

```json
{
  "success": true,
  "data": {
    "open": 18,
    "inProgress": 12,
    "resolved": 8,
    "closed": 94,
    "critical": 2
  }
}
```

---

## Ticket API Summary

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| GET    | /tickets                     | List tickets        |
| GET    | /tickets/{ticketId}          | Get ticket          |
| POST   | /tickets                     | Create ticket       |
| PATCH  | /tickets/{ticketId}          | Update ticket       |
| PATCH  | /tickets/{ticketId}/status   | Update status       |
| PATCH  | /tickets/{ticketId}/priority | Update priority     |
| PATCH  | /tickets/{ticketId}/assign   | Assign engineer     |
| POST   | /tickets/{ticketId}/reopen   | Reopen ticket       |
| DELETE | /tickets/{ticketId}          | Archive ticket      |
| GET    | /tickets/{ticketId}/history  | Ticket history      |
| GET    | /tickets/my                  | My assigned tickets |
| GET    | /tickets/summary             | Ticket statistics   |

# 11. Comment APIs

Comments enable collaboration between Tenant Admins and Engineers on tickets.

Each comment belongs to exactly one ticket.

---

## 11.1 List Comments

### Endpoint

```http
GET /api/v1/tickets/{ticketId}/comments
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "author": {
        "id": "uuid",
        "name": "John Doe"
      },
      "content": "Issue reproduced.",
      "isInternal": false,
      "createdAt": "2026-07-23T12:30:00Z"
    }
  ]
}
```

---

## 11.2 Add Comment

### Endpoint

```http
POST /api/v1/tickets/{ticketId}/comments
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Request

```json
{
  "content": "Root cause identified.",
  "isInternal": false
}
```

### Success Response

```json
{
  "success": true,
  "message": "Comment added successfully"
}
```

### Business Rules

- Ticket must exist.
- Empty comments are not allowed.
- Comment is recorded in Ticket History.
- Assigned engineer receives a notification.

---

## 11.3 Update Comment

### Endpoint

```http
PATCH /api/v1/comments/{commentId}
```

### Authentication

Bearer Token

### Authorization

Author, Tenant Admin

### Request

```json
{
  "content": "Updated comment."
}
```

### Business Rules

- Only the comment author or Tenant Admin may edit.
- Audit log entry is created.

---

## 11.4 Delete Comment

### Endpoint

```http
DELETE /api/v1/comments/{commentId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Description

Soft archives the comment.

---

## Comment API Summary

| Method | Endpoint                     | Description     |
| ------ | ---------------------------- | --------------- |
| GET    | /tickets/{ticketId}/comments | List comments   |
| POST   | /tickets/{ticketId}/comments | Add comment     |
| PATCH  | /comments/{commentId}        | Update comment  |
| DELETE | /comments/{commentId}        | Archive comment |

---

# 12. Attachment APIs

Attachments store files related to support tickets.

Files are stored in object storage; only metadata is stored in the database.

---

## 12.1 List Attachments

### Endpoint

```http
GET /api/v1/tickets/{ticketId}/attachments
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fileName": "error-log.pdf",
      "mimeType": "application/pdf",
      "size": 524288,
      "uploadedBy": "John Doe",
      "uploadedAt": "2026-07-23T13:00:00Z"
    }
  ]
}
```

---

## 12.2 Upload Attachment

### Endpoint

```http
POST /api/v1/tickets/{ticketId}/attachments
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Content-Type

```http
multipart/form-data
```

### Form Fields

| Field | Type   | Required |
| ----- | ------ | -------- |
| file  | Binary | Yes      |

### Success Response

```json
{
  "success": true,
  "message": "Attachment uploaded successfully"
}
```

### Business Rules

- Maximum file size enforced.
- MIME type validated.
- Virus scan performed before storage.
- Metadata stored in database.

---

## 12.3 Delete Attachment

### Endpoint

```http
DELETE /api/v1/attachments/{attachmentId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Business Rules

- Removes file from object storage.
- Audit log entry created.
- Metadata archived.

---

## Attachment API Summary

| Method | Endpoint                        | Description       |
| ------ | ------------------------------- | ----------------- |
| GET    | /tickets/{ticketId}/attachments | List attachments  |
| POST   | /tickets/{ticketId}/attachments | Upload attachment |
| DELETE | /attachments/{attachmentId}     | Delete attachment |

---

# 13. Notification APIs

Notifications inform users about ticket events.

---

## 13.1 List Notifications

### Endpoint

```http
GET /api/v1/notifications
```

### Authentication

Bearer Token

### Authorization

Tenant Admin, Engineer

### Query Parameters

| Parameter | Description      |
| --------- | ---------------- |
| status    | READ / UNREAD    |
| page      | Page number      |
| limit     | Records per page |

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Ticket Assigned",
      "message": "You have been assigned ticket TKT-00125.",
      "status": "UNREAD",
      "createdAt": "2026-07-23T13:30:00Z"
    }
  ]
}
```

---

## 13.2 Mark Notification as Read

### Endpoint

```http
PATCH /api/v1/notifications/{notificationId}/read
```

### Authentication

Bearer Token

### Success Response

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 13.3 Mark All Notifications as Read

### Endpoint

```http
PATCH /api/v1/notifications/read-all
```

### Authentication

Bearer Token

### Success Response

```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Notification API Summary

| Method | Endpoint                             | Description                    |
| ------ | ------------------------------------ | ------------------------------ |
| GET    | /notifications                       | List notifications             |
| PATCH  | /notifications/{notificationId}/read | Mark notification as read      |
| PATCH  | /notifications/read-all              | Mark all notifications as read |

# 14. Dashboard APIs

Dashboard APIs provide aggregated metrics and analytics for the authenticated tenant.

---

## 14.1 Dashboard Overview

### Endpoint

```http
GET /api/v1/dashboard
```

### Authentication

Bearer Token

### Authorization

Platform Admin, Tenant Admin

> Platform Admins receive a platform-level summary (tenant counts, system health). Tenant Admins receive tenant-scoped metrics (clients, projects, tickets).

### Success Response

```json
{
  "success": true,
  "data": {
    "clients": 18,
    "projects": 42,
    "users": 15,
    "tickets": {
      "open": 18,
      "inProgress": 12,
      "resolved": 8,
      "closed": 96
    }
  }
}
```

---

## 14.2 Ticket Analytics

### Endpoint

```http
GET /api/v1/dashboard/tickets
```

### Authentication

Bearer Token

### Query Parameters

| Parameter | Description |
| --------- | ----------- |
| from      | Start date  |
| to        | End date    |

### Success Response

```json
{
  "success": true,
  "data": {
    "created": 145,
    "resolved": 132,
    "averageResolutionHours": 6.2,
    "slaCompliance": 97.8
  }
}
```

---

## 14.3 Engineer Performance

### Endpoint

```http
GET /api/v1/dashboard/engineers
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "name": "John Doe",
      "assigned": 18,
      "resolved": 16,
      "avgResolutionHours": 5.4
    }
  ]
}
```

---

## Dashboard API Summary

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| GET    | /dashboard           | Dashboard overview   |
| GET    | /dashboard/tickets   | Ticket analytics     |
| GET    | /dashboard/engineers | Engineer performance |

---

# 15. Audit APIs

Audit APIs expose security and administrative activity logs.

Only Tenant Admins may access audit data.

---

## 15.1 List Audit Logs

### Endpoint

```http
GET /api/v1/audit-logs
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Query Parameters

| Parameter | Description    |
| --------- | -------------- |
| userId    | Filter by user |
| entity    | Entity name    |
| action    | Action type    |
| from      | Start date     |
| to        | End date       |

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "action": "CREATE_TICKET",
      "entity": "Ticket",
      "performedBy": "John Doe",
      "createdAt": "2026-07-23T13:45:00Z"
    }
  ]
}
```

---

## 15.2 Get Audit Log

### Endpoint

```http
GET /api/v1/audit-logs/{auditLogId}
```

### Authentication

Bearer Token

### Authorization

Tenant Admin

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "action": "ASSIGN_TICKET",
    "entity": "Ticket",
    "entityId": "uuid",
    "performedBy": "John Doe",
    "ipAddress": "192.168.1.10",
    "createdAt": "2026-07-23T14:00:00Z"
  }
}
```

---

## Audit API Summary

| Method | Endpoint                 | Description     |
| ------ | ------------------------ | --------------- |
| GET    | /audit-logs              | List audit logs |
| GET    | /audit-logs/{auditLogId} | Get audit log   |

---

# 16. Standard Error Codes

| Code                  | Description                      |
| --------------------- | -------------------------------- |
| VALIDATION_ERROR      | Invalid request data             |
| UNAUTHORIZED          | Authentication failed            |
| FORBIDDEN             | Permission denied                |
| NOT_FOUND             | Resource not found               |
| CONFLICT              | Resource already exists          |
| INVALID_STATUS        | Invalid ticket status transition |
| INVALID_PRIORITY      | Invalid priority value           |
| FILE_TOO_LARGE        | Attachment exceeds limit         |
| INVALID_FILE_TYPE     | Unsupported file type            |
| SLA_BREACH            | SLA exceeded                     |
| RATE_LIMIT_EXCEEDED   | Too many requests                |
| INTERNAL_SERVER_ERROR | Unexpected server error          |

---

# 17. API Security

The following security practices apply to all endpoints.

## Authentication

- JWT Access Token
- Refresh Token Rotation
- HTTPS Only

---

## Authorization

- Role-Based Access Control (RBAC)
- Tenant Isolation
- Resource Ownership Validation

---

## Validation

- Server-side validation
- Input sanitization
- File type validation
- File size limits

---

## Logging

The following events are logged:

- Login
- Logout
- Password change
- User creation
- Client creation
- Project updates
- Ticket operations
- Permission changes

---

# 18. API Checklist

Before production release, verify:

## Authentication

- Login works correctly
- Refresh token rotation implemented
- Logout revokes refresh token

---

## Authorization

- RBAC enforced
- Cross-tenant access prevented
- Unauthorized requests return 403

---

## Validation

- Required fields validated
- Invalid input rejected
- Duplicate resources prevented

---

## Performance

- Pagination implemented
- Filtering implemented
- Sorting implemented
- Database indexes verified

---

## Security

- HTTPS enforced
- Passwords hashed
- JWT secrets protected
- Rate limiting enabled
- File uploads scanned

---

## Logging

- Audit logging enabled
- Ticket history recorded
- Assignment history maintained

---

# 19. API Summary

| Module         | Status   |
| -------------- | -------- |
| Authentication | Complete |
| Users          | Complete |
| Clients        | Complete |
| Projects       | Complete |
| Tickets        | Complete |
| Comments       | Complete |
| Attachments    | Complete |
| Notifications  | Complete |
| Dashboard      | Complete |
| Audit Logs     | Complete |

---

# 20. Conclusion

This document defines the REST API contract for the Multi-Tenant Ticketing System.

Together with the Product Requirements Document (PRD), Architecture, Application Flow, Phase Scope, and Database Schema, it provides a complete technical specification for implementing a secure, scalable, and production-ready multi-tenant SaaS platform.

All future API changes should maintain backward compatibility where possible and follow semantic versioning principles.
