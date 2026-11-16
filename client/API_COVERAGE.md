# API coverage

All Axios requests use the configured `VITE_API_URL` and `withCredentials: true`. Responses use the server's `{ success, message, data }` shape; errors display the server's `message` and DTO `errors` inline where there is a matching form field.

| Method and endpoint | Frontend usage |
|---|---|
| `GET /health` | Footer live status pill (`components/layout/Footer.jsx`, TanStack Query) |
| `POST /auth/register` | Register form; success renders the verification inbox state |
| `POST /auth/login` | Login form; stores the returned access token in in-memory auth context |
| `POST /auth/refresh` | Auth bootstrap and Axios single-flight response interceptor |
| `POST /auth/logout` | Dashboard sign-out action; auth state and query cache are cleared |
| `POST /auth/logout-all` | Dashboard security action; clears local session on completion |
| `GET /auth/me` | Bootstrap after refresh, login hydration, and OAuth exchange hydration |
| `PATCH /auth/me` | Dashboard profile form updates the display name |
| `POST /auth/change-password` | Dashboard security modal; clears local auth and returns to sign in |
| `POST /auth/forgot-password` | Forgot-password form |
| `POST /auth/reset-password` | Reset-password form; also accepts the backend email-link route |
| `POST /auth/verify-email` | Verification page on mount; also accepts the backend email-link route |
| `POST /auth/resend-verification` | Register success state, login verification banner, and verification page |
| `GET /auth/sessions` | Dashboard active-session list |
| `DELETE /auth/sessions/:sessionId` | Dashboard revoke action with an accessible confirmation dialog |
| `POST /auth/oauth/exchange` | OAuth callback page exchanges the one-time code and hydrates `/auth/me` |
| `GET /auth/google` | `authApi.beginOAuth("google")` browser redirect; enable via Vite flag after server setup |
| `GET /auth/github` | `authApi.beginOAuth("github")` browser redirect; enable via Vite flag after server setup |
| `GET /auth/google/callback` | Server-side Passport callback redirects to the client OAuth callback page |
| `GET /auth/github/callback` | Server-side Passport callback redirects to the client OAuth callback page |

Provider callback routes are server redirects, not client-side API fetches. No additional backend endpoints are assumed.
