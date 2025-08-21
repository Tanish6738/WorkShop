# PromptVault API Documentation (MVP)

Base URL: `http://localhost:3000/api/v1`
Responses: `{ success: true|false, data?, error? }`

## Endpoint Summary
| Area | Method | Path | Description | Auth |
|------|--------|------|-------------|------|
| Health | GET | /health | Liveness check | Public |
| Meta | GET | /version | App version | Public |
| Auth | POST | /auth/register | Register user | Public |
| Auth | POST | /auth/login | Login & get tokens | Public |
| Auth | POST | /auth/refresh | New access token (refresh cookie) | Refresh cookie |
| Auth | POST | /auth/logout | Clear refresh token | Access/Refresh |
| Auth | GET | /auth/me | Current user | Access |
| Auth | PATCH | /auth/me | Update profile | Access |
| Auth | PATCH | /auth/me/password | Change password | Access |
| Users | GET | /users/:id | Public profile | Public |
| Users | GET | /users/:id/prompts | User public prompts | Public |
| Users | GET | /users/:id/collections | User public collections | Public |
| Prompts | POST | /prompts | Create prompt | Access |
| Prompts | GET | /prompts | List (public or mine) | Optional |
| Prompts | GET | /prompts/:id | Get prompt | Optional |
| Prompts | PUT | /prompts/:id | Update prompt (+version) | Owner/Admin |
| Prompts | PATCH | /prompts/:id/visibility | Change visibility | Owner/Admin |
| Prompts | DELETE | /prompts/:id | Delete prompt | Owner/Admin |
| Prompts | GET | /prompts/:id/versions | List versions | Optional (if visible) |
| Prompts | GET | /prompts/:id/versions/:versionNumber | Get version | Optional |
| Prompts | POST | /prompts/:id/remix | Remix (fork) | Access |
| Prompts | GET | /prompts/:id/remixes | List remixes | Optional |
| Prompts | POST | /prompts/:id/view | Increment views | Optional |
| Prompts | POST | /prompts/:id/like | Like prompt | Access |
| Prompts | DELETE | /prompts/:id/like | Unlike prompt | Access |
| Collections | POST | /collections | Create collection | Access |
| Collections | GET | /collections | List collections | Optional |
| Collections | GET | /collections/:id | Get collection | Optional |
| Collections | PUT | /collections/:id | Update collection | Owner/Admin |
| Collections | DELETE | /collections/:id | Delete collection | Owner/Admin |
| Collections | POST | /collections/:id/prompts | Add prompt to collection | Owner/Admin |
| Collections | DELETE | /collections/:id/prompts/:promptId | Remove prompt from collection | Owner/Admin |
| Engagement | POST | /prompts/:id/favorite | Favorite prompt | Access |
| Engagement | DELETE | /prompts/:id/favorite | Unfavorite prompt | Access |
| Engagement | GET | /prompts/:id/engagement | Engagement stats | Optional |
| Engagement | GET | /me/favorites | List favorites | Access |
| Engagement | GET | /me/likes | List liked prompts | Access |
| Admin | GET | /admin/stats | Platform stats | Admin |
| Admin | GET | /admin/users | List users | Admin |
| Admin | PATCH | /admin/users/:id/ban | Ban user | Admin |
| Admin | PATCH | /admin/users/:id/unban | Unban user | Admin |
| Admin | POST | /admin/users/bulk/role | Bulk role change | Admin |
| Admin | POST | /admin/users/bulk/ban | Bulk ban users | Admin |
| Admin | POST | /admin/users/bulk/unban | Bulk unban users | Admin |
| Admin | GET | /admin/prompts | List public prompts | Admin |
| Admin | POST | /admin/prompts/bulk/delete | Bulk delete prompts | Admin |
| Admin | GET | /admin/collections | List public collections | Admin |
| Admin | POST | /admin/collections/bulk/delete | Bulk delete collections | Admin |

## 1. Authentication
Order: Register -> Login -> Authenticated calls -> Refresh (when 401 due to expiry) -> Logout

### POST /auth/register
Request Body Example:
```
{
	"name": "Alice",
	"email": "alice@example.com",
	"password": "Passw0rd!"
}
```
201 Response (data excerpt):
```
{ "success": true, "data": { "id": "<userId>", "email": "alice@example.com", "name": "Alice" } }
```

### POST /auth/login
Body:
```
{ "email": "alice@example.com", "password": "Passw0rd!" }
```
Response:
```
{ "success": true, "data": { "accessToken": "<JWT>", "user": { "id": "<userId>", "email": "alice@example.com", "name": "Alice" } } }
```

### GET /auth/me
Header: `Authorization: Bearer <accessToken>`

### PATCH /auth/me
Body (any subset):
```
{ "name": "Alice Cooper", "avatarUrl": "https://example.com/a.png", "bio": "Growth marketer" }
```

### PATCH /auth/me/password
```
{ "currentPassword": "Passw0rd!", "newPassword": "N3wStr0ngPass!" }
```

### POST /auth/refresh
Body: (none) – uses refresh cookie. Response contains new `accessToken`.

### POST /auth/logout
Body: (none). Clears refresh cookie.

## 2. Users (Public)
### GET /users/:id
Returns public profile + counts.
### GET /users/:id/prompts
Public prompts by user.
### GET /users/:id/collections
Public collections by user.

## 3. Prompts
Bearer token required for mutation (create/update/remix/like). Reads allow anonymous if public.

### POST /prompts
```
{
	"title": "Blog Outline Generator",
	"description": "Generates a structured outline for a blog topic.",
	"content": "You are an expert content strategist...",
	"category": "writing",
	"tags": ["outline", "blog", "seo"],
	"visibility": "public"
}
```

### GET /prompts (query params)
`?q=outline&tags=blog,seo&sort=likes&page=1&limit=20`

### GET /prompts/:id
No body.

### PUT /prompts/:id (update + version if content changed)
```
{
	"description": "Generates a detailed outline including keyword suggestions.",
	"content": "You are an expert SEO content strategist for SaaS...",
	"tags": ["outline", "blog", "seo", "saas"]
}
```

### PATCH /prompts/:id/visibility
```
{ "visibility": "private" }
```

### DELETE /prompts/:id
No body.

### GET /prompts/:id/versions
No body.

### GET /prompts/:id/versions/:versionNumber
No body.

### POST /prompts/:id/remix
```
{
	"title": "Blog Outline Generator (E-commerce Focus)",
	"description": "Tailored for category pages.",
	"content": "You are an e-commerce content strategist..."
}
```

### GET /prompts/:id/remixes
No body.

### POST /prompts/:id/view
No body (increments view counter).

### POST /prompts/:id/like
No body. Response: `{ liked: true }`

### DELETE /prompts/:id/like
No body. Response: `{ liked: false }`

## 4. Collections

### POST /collections
```
{
	"name": "Writing Tools",
	"description": "Prompts that help with drafting and editing.",
	"visibility": "public"
}
```

### GET /collections
Example: `?mine=true&visibility=private&page=1&limit=10`

### GET /collections/:id
No body.

### PUT /collections/:id
```
{
	"description": "Prompts for drafting, editing, and optimizing blog posts.",
	"visibility": "private"
}
```

### DELETE /collections/:id
No body.

### POST /collections/:id/prompts
```
{ "promptId": "<promptId>" }
```

### DELETE /collections/:id/prompts/:promptId
No body.

## 5. Engagement

### POST /prompts/:id/favorite
No body. Response: `{ favorited: true }`

### DELETE /prompts/:id/favorite
No body. Response: `{ favorited: false }`

### GET /prompts/:id/engagement
No body. Response: `{ likes, favorites }`

### GET /me/favorites
No body.

### GET /me/likes
No body.

## 6. Admin (Requires admin role)
Base path: `/api/v1/admin`

### GET /admin/stats
No body.

### GET /admin/users?q=&page=&limit=
No body.

### PATCH /admin/users/:id/ban
No body.

### PATCH /admin/users/:id/unban
No body.

### POST /admin/users/bulk/role
```
{ "userIds": ["<userId1>", "<userId2>"], "role": "admin" }
```

### POST /admin/users/bulk/ban
```
{ "userIds": ["<userId1>", "<userId2>"] }
```

### POST /admin/users/bulk/unban
```
{ "userIds": ["<userId1>"] }
```

### GET /admin/prompts?page=&limit=
No body.

### POST /admin/prompts/bulk/delete
```
{ "promptIds": ["<promptId1>", "<promptId2>"] }
```

### GET /admin/collections?page=&limit=
No body.

### POST /admin/collections/bulk/delete
```
{ "collectionIds": ["<collectionId1>", "<collectionId2>"] }
```

## 7. Testing Flow Using Seed Data
Seed creates users:
```
admin@example.com / Passw0rd!
alice@example.com / Passw0rd!
bob@example.com   / Passw0rd!
```
Flow:
1. Login as Alice -> create public & private prompt
2. List public prompts (no auth) -> see public only
3. List with `mine=true` (auth) -> see both
4. Update public prompt content -> new version
5. Get versions / specific version
6. Remix public prompt (as Bob)
7. Like + favorite original (Alice + Bob)
8. View engagement
9. Create collection & add prompt
10. Admin login -> stats -> list users -> bulk ops (optional)

## 8. Example cURL
```
curl -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"Passw0rd!"}'

curl -X POST http://localhost:3000/api/v1/prompts -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"title":"Idea Generator","content":"You are a creative idea machine...","category":"brainstorm","tags":["ideas","creative"],"visibility":"public"}'
```

## 9. Error Codes
`VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `SERVER_ERROR`.

## 10. Seed Script
Run: `node seed.js` (env vars set). Provides sample users & initial prompts/collection.

