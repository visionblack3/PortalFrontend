# CareerNest — Frontend

A React frontend for the CareerPortal Spring Boot backend: job seekers search and apply,
employers post roles and run their pipeline, admins moderate the board.

## Stack

- React 19 + Vite
- react-router-dom v7 (client-side routing, role-gated routes)
- axios (JWT auto-attached via interceptor, errors normalized from your backend's shapes)
- Plain CSS design system (no UI kit) — see `src/styles/index.css`

## Setup

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default and talks to the API at the URL in
`.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Change that if your Spring Boot app runs elsewhere. Run `npm run build` for a production
bundle in `dist/`.

## ⚠️ Required backend change: CORS

Right now only `AdminController` has `@CrossOrigin(origins = "*")`. The Employer,
JobSeeker, and User (auth) controllers don't, and `SecurityConfig` has no CORS
configuration of its own — so the browser will block most requests from this frontend
(different origin: `5173` vs `8080`).

The cleanest fix is one CORS bean in `SecurityConfig`, rather than annotating every
controller. Add this and wire it into the filter chain:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

And in `securityFilterChain(...)`, add `.cors(cors -> cors.configurationSource(corsConfigurationSource()))`
before `.csrf(...)`. You can then drop the `@CrossOrigin` on `AdminController` too, since
it'll be handled centrally. Happy to make this edit directly in your backend files if you
share them again with that ask.

## How it maps to your API

| Area | Endpoints used |
|---|---|
| Auth | `POST /api/auth/register` (binds directly to the `User` entity: name, email, password, phone, role — not `RegisterRequest`, since `UserController` takes `User` as the body), `POST /api/auth/login`, `POST /api/auth/forgot-password/send-otp`, `POST /api/auth/forgot-password/reset` |
| Job seeker | `GET /api/seeker/jobs`, `GET /api/seeker/jobs/search`, `POST /api/seeker/jobs/{id}/apply`, `GET /api/seeker/applications` |
| Employer | `POST/GET/PUT/DELETE /api/employer/jobs[...]`, `GET /api/employer/jobs/{id}/applications`, `PUT /api/employer/applications/{id}/status` |
| Admin | `GET/PUT/DELETE /api/admin/jobs[...]`, `GET /api/admin/applications` (read-only — there's no admin endpoint to change an application's status) |

A few things worth knowing:

- **JWT storage**: token + basic user info (id, email, name, role) are kept in
  `localStorage` and attached to every request as `Authorization: Bearer <token>`. On a
  401 the app clears the session; on 403 it just surfaces the error (still logged in, not
  allowed to do that specific thing).
- **"Already applied" state**: `GET /api/seeker/jobs` doesn't return whether the current
  seeker already applied, so the Browse Jobs page separately loads `GET
  /api/seeker/applications` and cross-references job IDs client-side to show status
  instead of an apply form.
- **Editing a job**: there's no `GET /api/employer/jobs/{id}` (or admin equivalent), so
  the edit form is pre-filled from the row you clicked (passed via router state); if
  someone lands on the edit URL directly, it refetches the full list and finds the job by
  id.
- **Registration role**: the sign-up form only offers Job Seeker / Employer — no
  self-serve Admin signup, on the assumption you'll seed admin accounts directly.
- **Status values**: the employer's status dropdown is limited to what
  `EmployerService.ALLOWED_STATUSES` accepts — `APPLIED, SHORTLISTED, ACCEPTED, REJECTED,
  HIRED`.

## Project structure

```
src/
  api/            axios instance + one module per controller area
  components/     shared UI (Navbar, JobCard, status badges, form fields, guards)
  context/        AuthContext (session), ToastContext (notifications)
  lib/            formatting + role helpers
  pages/
    seeker/       Browse jobs, My applications
    employer/     My postings, Post/Edit job, Applicants
    admin/        All jobs, Edit job, All applications
  styles/         index.css — the whole design system
```
# PortalFrontend
