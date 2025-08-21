## PromptVault – MVP Specification & API Routes

PromptVault is a “GitHub for prompts”: create, version, share, collect, remix, and engage with AI prompts. This README captures the corrected MVP scope plus a detailed API contract to start building immediately.

---

## 🔑 Core MVP Features

1. Authentication & Profiles
  - Email/password (JWT based). (OAuth can be added later.)
  - Public profile: avatar, bio, public prompts, public collections.
2. Prompt Authoring
  - Create / read / update (own) prompts.
  - Version history (append-only versions array).
  - Visibility: public | private.
3. Prompt Management
  - Categories & free-form tags (indexed for search/filter).
  - Public listing & filtering.
4. Collections
  - User-owned collections containing references to prompts (own or public).
5. Remixing
  - Fork an existing prompt -> new prompt linked to original (attribution retained).
6. Engagement
  - Like (upvote) & Favorite (bookmark) prompts.
7. Search & Filtering
  - Keyword (title, description, content, tags) + category + tags + author + sort (recent, likes, remixes, popularity).
8. Basic Analytics (phase 1 lightweight)
  - Increment & store view counts, like counts, remix counts (denormalized counters for listing speed).

---

## ❌ Deferred (Post-MVP)
Advanced AI execution, collaborative editing, comments, monetization, recommendation engine, real-time features, offline/mobile.

---

## 🏗️ High-Level Architecture

```
Frontend (React / Next.js + Tailwind)
  | REST / JSON + JWT
Backend (Node.js / Express)
  | Mongoose ODM
MongoDB Atlas
```

---

## 📦 MongoDB Collections (Schemas Outline)

### users
```
_id, name, email (unique), passwordHash, avatarUrl, bio,
oauthProviders?: [{ provider, providerId }],
createdAt, updatedAt
```

### prompts
```
_id, title, description, content, category, tags[], visibility,
createdBy (ref users), originalPromptId? (ref prompts for remix chain),
versions: [{ versionNumber, content, updatedBy, updatedAt }],
stats: { views: Number, likes: Number, favorites: Number, remixes: Number },
createdAt, updatedAt
```

### collections
```
_id, name, description, visibility, createdBy (ref users), promptIds[],
createdAt, updatedAt
```

### engagements
```
_id, promptId (ref prompts), userId (ref users), type: like|favorite, createdAt
-- Unique compound index: (promptId, userId, type)
```

### remixes
```
_id, originalPromptId, remixedPromptId, remixedBy, createdAt
-- Optional: could be derived (presence of originalPromptId in prompt), but kept for audit & querying.
```

### auditLogs (optional lightweight)
```
_id, actorId, entityType, entityId, action, metadata{}, createdAt
```

---

## 🔐 Auth Model
JWT (access token, short-lived) + refresh token (HTTP-only cookie) recommended. Passwords hashed with bcrypt. Middleware: `requireAuth`, `optionalAuth`, `requireOwnerOrAdmin`.

---

## 🧭 API Conventions
Base URL: `/api/v1`
Response envelope:
```
{ success: true|false, data?: any, error?: { code, message, details? } }
```
Errors: HTTP status + error.code (e.g., `UNAUTHORIZED`, `NOT_FOUND`, `VALIDATION_ERROR`).

Pagination: `?page=1&limit=20` returns `{ page, limit, total, items: [] }`.
Filtering: query params; arrays accepted via comma lists (`tags=ai,marketing`).

---

## 📚 Route Summary

### Health & Meta
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /health | Liveness probe | public |
| GET | /version | App/version info | public |

### Auth
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /auth/register | Register new user | public |
| POST | /auth/login | Login, returns tokens | public |
| POST | /auth/logout | Invalidate refresh token | refresh cookie |
| POST | /auth/refresh | Issue new access token | refresh cookie |
| GET | /auth/me | Current user profile | access |
| PATCH | /auth/me | Update own profile (name, avatar, bio) | access |
| PATCH | /auth/me/password | Change password | access |

### Users / Profiles
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /users/:id | Public profile (public prompts & collections counts) | public |
| GET | /users/:id/prompts | Public prompts of user | public |
| GET | /users/:id/collections | Public collections of user | public |

### Prompts
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /prompts | Create prompt | access |
| GET | /prompts | List public (or own if `mine=true`) prompts | optional |
| GET | /prompts/:id | Get prompt (enforce visibility) | optional |
| PUT | /prompts/:id | Update prompt (fields + new version) | owner |
| PATCH | /prompts/:id/visibility | Change visibility | owner |
| DELETE | /prompts/:id | Soft delete (optional) or hard delete | owner |
| GET | /prompts/:id/versions | List versions | optional (if public/owner) |
| GET | /prompts/:id/versions/:versionNumber | Get specific version | optional |
| POST | /prompts/:id/remix | Create remix (fork) | access |
| GET | /prompts/:id/remixes | List direct remixes | optional |
| POST | /prompts/:id/view | Increment (idempotent per session/ip) | optional |

Query params for `/prompts`:
`q` (keyword), `category`, `tags`, `author`, `visibility` (owner only), `sort=(recent|likes|remixes|views)`, `page`, `limit`.

### Collections
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /collections | Create collection | access |
| GET | /collections | List public collections (or own with `mine=true`) | optional |
| GET | /collections/:id | Get collection (respect visibility) | optional |
| PUT | /collections/:id | Update metadata | owner |
| PATCH | /collections/:id/visibility | Change visibility | owner |
| DELETE | /collections/:id | Delete collection | owner |
| POST | /collections/:id/prompts | Add prompt (body: { promptId }) | owner |
| DELETE | /collections/:id/prompts/:promptId | Remove prompt | owner |

### Engagement (Likes / Favorites)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /prompts/:id/like | Like prompt (idempotent) | access |
| DELETE | /prompts/:id/like | Remove like | access |
| POST | /prompts/:id/favorite | Favorite prompt | access |
| DELETE | /prompts/:id/favorite | Remove favorite | access |
| GET | /prompts/:id/engagement | Aggregate engagement stats | optional |
| GET | /me/favorites | List user favorites | access |
| GET | /me/likes | List user liked prompts | access |

### Search (Dedicated Endpoint Option)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /search/prompts | Advanced search (weighted scoring) | optional |
| GET | /search/collections | Search collections | optional |

### Admin (Optional Early)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /admin/stats | Platform aggregates | admin |
| GET | /admin/users | Paginated users | admin |
| PATCH | /admin/users/:id/ban | Ban user | admin |

---

## 🧪 Example Payloads

Create Prompt (POST /prompts)
```
{
  "title": "Marketing Angle Generator",
  "description": "Generates 5 fresh angles for a product based on features.",
  "content": "You are a creative marketing strategist...",
  "category": "marketing",
  "tags": ["copywriting", "ideas"],
  "visibility": "public"
}
```
Response:
```
{ "success": true, "data": { "id": "...", "title": "Marketing Angle Generator", "versions": [{"versionNumber":1}], ... } }
```

Remix (POST /prompts/:id/remix)
```
{ "title": "Marketing Angle Generator (SaaS Focus)", "modifications": "Tailored for SaaS feature benefits." }
```

Like (POST /prompts/:id/like)
```
{ }
```
Response increments like count.

Add to Collection (POST /collections/:id/prompts)
```
{ "promptId": "<promptId>" }
```

Search (GET /prompts?q=angle&tags=ideas,copywriting&sort=likes)
Response includes pagination meta.

---

## 🗂 Suggested Backend Folder Structure
```
backend/
  src/
   db/            # env, db connection
   models/            # mongoose schemas
   routes/            # route modules (auth, prompts, collections, engagements)
   controllers/       # request handlers
   services/          # business logic
   utils/             # helpers
   auth/              # jwt, password, strategies
   tests/             # unit/integration
   app.js             # express app
  index.js          # start script
  package.json
  .env.example
```

---

## 🔄 Versioning Strategy
On each prompt update that changes `content`, append a new version object:
```
{
  versionNumber: <increment>,
  content: <new content>,
  updatedBy: <userId>,
  updatedAt: <Date>
}
```
Store current content at root for fast reads. Version retrieval uses sub-document filtering.

---

## ⚙️ Index Recommendations
```
prompts: { title: text, description: text, content: text, tags: 1, category: 1, createdBy: 1 }
engagements: { promptId: 1, userId: 1, type: 1 } UNIQUE
collections: { createdBy: 1, visibility: 1 }
users: { email: 1 } UNIQUE
```
Optional compound for listing: `{ visibility: 1, 'stats.likes': -1, createdAt: -1 }`.

---

## 🔒 Security & Validation Notes
 - Enforce ownership before mutation.
 - Strip HTML or sanitize markdown to prevent XSS.
 - Rate limit auth & search endpoints.
 - Use HTTP-only secure cookies for refresh tokens.
 - Hash passwords with bcrypt (>= 12 rounds).
 - Validate ObjectIds and request bodies (Zod / Joi / Yup).

---

## 🧹 Error Codes (Sample)
| Code | Meaning |
|------|---------|
| VALIDATION_ERROR | Invalid input |
| UNAUTHORIZED | Missing/invalid auth |
| FORBIDDEN | Not owner / insufficient rights |
| NOT_FOUND | Resource missing |
| CONFLICT | Duplicate (e.g., like already exists) |
| RATE_LIMITED | Too many requests |
| SERVER_ERROR | Unhandled exception |

---

## 🚀 Tech Stack Recommendations
Frontend: React/Next.js + Tailwind CSS
Backend: Node.js + Express + Mongoose
DB: MongoDB Atlas
Auth: JWT (access) + refresh cookie
Testing: Jest / Vitest + Supertest
Lint/Format: ESLint + Prettier
Deployment: Vercel/Netlify (frontend), Render/Fly.io/Heroku (backend)
CI: GitHub Actions (lint, test, build)

---

## ✅ MVP Completion Checklist (Engineer View)
| Area | Status Criteria |
|------|-----------------|
| Auth | Register/login/refresh, profile update, password change |
| Prompts | CRUD, visibility, version list, remix, counters |
| Collections | CRUD, add/remove prompt |
| Engagement | Like/favorite add/remove + counts |
| Search | Keyword + filters + sorting |
| Security | Auth middleware + ownership + validation |
| DX | Lint, tests baseline, env template |

---

## 📄 License
Add a license file before releasing publicly (MIT recommended for openness).

---

Happy building! Refine or extend this spec as features evolve.
