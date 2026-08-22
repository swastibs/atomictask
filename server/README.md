# AtomicTask API

Express and MongoDB API for secure authentication and task management.

## Run locally

1. Copy `.env.example` to `.env`, generate a random `JWT_SECRET`, and set `MONGO_URI`.
2. Start MongoDB and Redis (Redis is used for token blacklist checks).
3. Run `npm install` and `npm start`.
4. Run `npm test` while the API is running on port 8080.

The API limits JSON bodies to 10 KB, uses Helmet/CORS, validates request shapes with Joi, hashes passwords with bcrypt, and never returns password fields.

## Authentication

`POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/change-password`, and `GET /api/auth/me` are available. `POST /api/auth/update-password` remains an alias. Login failures are throttled per IP and identity for 5 failures per 15 minutes. Password changes increment the session version and blacklist the current token.

## Tasks

Tasks are soft-deleted and visible to their creator, assignees, or administrators. Supported canonical storage values are `pending`, `in-progress`, `completed`, `cancelled`, and `archived`, with `URGENT`, `TODO`, `IN_PROGRESS`, `DONE`, and `CANCELLED` accepted as API aliases. CRUD, pagination, search, sorting, bulk updates, comments, assignee management, subtasks, restore, trash, and statistics are available under `/api/tasks`.

## Security notes

- Request schemas reject unknown fields and constrain IDs, enums, strings, arrays, and pagination.
- Mongo queries are scoped by authenticated user/assignment and search expressions are regex-escaped.
- Task writes use an explicit allowlist; role fields and ownership cannot be mass-assigned.
- Production deployments should use HTTPS, a strong secret from a secret manager, restricted `CLIENT_URL`, and a shared Redis instance for horizontally scaled login throttling.