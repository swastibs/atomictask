# AtomicTasks frontend

The client is a React 19 + Vite single-page app written in JavaScript and JSX. It uses Tailwind CSS v4, Keyframery's CSS-animated React components, React Router, TanStack Query, React Hook Form + Zod, Axios, and Sonner. Keyframery's 83 components are installed as editable source in `src/components/keyframery/`; the app uses its tabs, menus, dialogs, accordion, buttons, inputs, and motion-style switcher.

## Run locally

Use Node.js 20 or newer and pnpm:

```sh
cd client
pnpm install
cp .env.example .env
pnpm dev
```

Vite runs at `http://localhost:5173`. Start the API separately at `http://localhost:8080` and set its `CLIENT_URL` to `http://localhost:5173`; the API must allow credentialed CORS from that origin.

For production:

```sh
pnpm build
pnpm preview
```

Deploy `dist/` behind an SPA fallback so routes such as `/auth/callback` and `/auth/verify-email` serve `index.html`.

The Keyframery source is generated as TSX by the shadcn CLI; the application and its own components remain JSX/JavaScript. `tsconfig.json` provides the `@/` alias and JSX settings required by the CLI.

## Environment

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080/api` | Backend API base URL |
| `VITE_CLIENT_URL` | `http://localhost:5173` | Client origin used for local setup |
| `VITE_GOOGLE_OAUTH_ENABLED` | `false` | Enable the Google redirect button only when the server provider is configured |
| `VITE_GITHUB_OAUTH_ENABLED` | `false` | Enable the GitHub redirect button only when the server provider is configured |

The backend health response currently returns `{ success, message, uptime }` (with `uptime` at the top level), not a `project` field. The footer displays the configured app name locally and the API's actual status/uptime.

Email links from the backend use `/auth/verify-email` and `/auth/reset-password`; both are supported alongside `/verify-email` and `/reset-password`.

## Auth behavior

- Access tokens stay in React context and an in-memory Axios bridge only; they are never persisted to browser storage.
- The refresh token stays in the backend's HTTP-only cookie. Axios sends it using `withCredentials`.
- Startup silently calls `/auth/refresh`, then `/auth/me`. Protected routes wait for that one bootstrap attempt.
- Concurrent `401` responses share one refresh request; retried requests are marked and auth endpoints are excluded from refresh retries.
- A failed refresh clears auth state and redirects to `/login?reason=session_expired`.
- Google/GitHub are full-page redirects. The server does not report provider availability in `/health`, so enable each button through its Vite flag only after configuring the matching backend credentials and callback URL.
- No waitlist or task/habit endpoints are called. Marketing visuals are illustrative; the dashboard only uses real auth and session data.

See [API_COVERAGE.md](./API_COVERAGE.md) for the endpoint-to-screen map. The current backend route/response contract is the source of truth; for example, `/auth/me` returns the user directly in `data`, and `/health` places `uptime` at the top level.
