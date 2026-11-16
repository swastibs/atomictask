# Server

The API uses MongoDB, Passport, short-lived JWT access tokens, rotating refresh
tokens, and Passport OAuth login with Google and GitHub.

## Setup

Use Node.js 20 or newer.

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` to your MongoDB server/cluster connection string and generate
   three different secrets of at least 32 characters for `JWT_SECRET`,
   `REFRESH_TOKEN_SECRET`, and `SESSION_SECRET`. The database is selected from
   `NODE_ENV`: `development` uses `atomictask_dev`, `stage` uses
   `atomictask_stage`, and `production` uses `atomictask_prod`. This selection
   overrides any database name in the URI. MongoDB creates the selected
   database when the application first writes data.
   For example, generate each with `openssl rand -hex 32`.
3. Configure `CLIENT_URL` and `API_URL`. For production, both must use HTTPS.
4. Configure the SMTP values to enable registration, verification, and password
   reset emails.
5. Add OAuth credentials when enabling Google or GitHub sign-in.

```sh
pnpm install
pnpm dev
```

Set these callback URLs in the provider consoles:

- Google: `${API_URL}/api/auth/google/callback`
- GitHub: `${API_URL}/api/auth/github/callback`

An unconfigured OAuth provider returns `503 Service Unavailable`.
For a frontend hosted on a different site, set `COOKIE_SAME_SITE=none`; this
requires HTTPS. Mutating requests with a browser `Origin` must match
`CLIENT_URL`.

## Authentication endpoints

All routes are prefixed with `/api/auth`.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/register` | Create an account and send email verification |
| `POST` | `/login` | Authenticate with email and password |
| `POST` | `/refresh` | Rotate the HttpOnly refresh-token cookie |
| `POST` | `/logout` | Revoke the current refresh token |
| `POST` | `/logout-all` | Revoke all sessions and access tokens |
| `GET` | `/me` | Get the authenticated user |
| `PATCH` | `/me` | Update the user's name |
| `POST` | `/change-password` | Change the authenticated user's password |
| `POST` | `/forgot-password` | Send password-reset instructions |
| `POST` | `/reset-password` | Set a new password with a reset token |
| `POST` | `/verify-email` | Verify an email using its one-time token |
| `POST` | `/resend-verification` | Resend email verification instructions |
| `GET` | `/sessions` | List active refresh-token sessions |
| `DELETE` | `/sessions/:sessionId` | Revoke one session |
| `GET` | `/google` | Start Google OAuth |
| `GET` | `/google/callback` | Complete Google OAuth |
| `GET` | `/github` | Start GitHub OAuth |
| `GET` | `/github/callback` | Complete GitHub OAuth |
| `POST` | `/oauth/exchange` | Exchange a one-time OAuth code for tokens |

Use the returned access token as `Authorization: Bearer <token>`. The refresh
token is stored in an HttpOnly cookie; browser clients should send credentials
when calling the API. OAuth callbacks redirect to
`${CLIENT_URL}/auth/callback?code=...`; the client should POST that code to
`/api/auth/oauth/exchange` and discard it after exchange.

New local accounts must verify their email before signing in. The frontend is
responsible for submitting verification and password-reset tokens to the
corresponding endpoints. Passwords must be at least 12 characters and no more
than 72 UTF-8 bytes.

`requireAuth` and `requireRoles` from `src/modules/auth/auth.middleware.js` can
protect feature routes. Roles are `user`, `team_admin`, and `admin`; clients
cannot set their own role.
