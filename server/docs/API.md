# API Reference

All task routes require `Authorization: Bearer <access-token>`.

## Auth

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Register with name, email, optional username, and password |
| POST | `/api/auth/login` | Login with email or username |
| POST | `/api/auth/logout` | Blacklist current token |
| POST | `/api/auth/change-password` | Change password and invalidate current session |
| GET | `/api/auth/me` | Return current user |
| PATCH | `/api/users/profile` | Update name, username, or avatar |

## Tasks

| Method | Path | Purpose |
| --- | --- | --- |
| GET/POST | `/api/tasks` | List with `page`, `limit`, `search`, filters, and create |
| GET/PATCH/DELETE | `/api/tasks/:id` | Read, update, or soft-delete |
| POST/GET | `/api/tasks/:id/comments` | Add/list comments |
| POST/DELETE | `/api/tasks/:id/assignees[/:userId]` | Add/remove assignees |
| POST | `/api/tasks/bulk-update` | Bulk update `{ ids, updateData }` |

## Security checklist

Use HTTPS and secret-manager backed environment variables in production. Keep MongoDB and Redis private, configure a precise CORS origin, rotate JWT secrets through a planned migration, monitor 401/429 rates, and run dependency/security scans in CI.