---
summary: The self-made sign-in: bcrypt passwords, a JWT in a cookie, and the user, owner and admin checks
updated: 2026-06-25
---

# Auth (self-made)

No auth library for the core flow. Full detail: [sources/SPEC.md](../sources/SPEC.md) §6.

## Authentication
1. Register/login → bcrypt verify/hash (cost ≥ 10).
2. Sign JWT (HS256) with claims `{ sub: userId, role, name, email, iat, exp }`,
   `exp` = 7 days (internal app; single long-lived token, no refresh in v1).
3. Set cookie `se_session`: `httpOnly; SameSite=Lax; Secure (prod); Path=/`.
4. A `preValidation` guard on protected routes (`requireAuth`, `requireAdmin`, built by `plugins/auth` from the settings) verifies the cookie → `request.user`. It runs before schema validation, so a signed-out request is a 401, never a 400.
5. Secret `JWT_SECRET` from env; required in prod, ephemeral dev fallback + warning.

## Authorization (server-side, every protected route)
- `requireAuth` — 401 if no/invalid token.
- `requireAdmin` — 403 unless `role === 'admin'`.
- **Host-or-admin** for `PATCH/DELETE /events/:id` — load event, allow if
  `host_id === user.sub` or admin, else 403.
- **Self-only** for `/users/me*` and notification owner checks.
- Never trust client-supplied identity; derive acting user from the verified token.

## Security baseline (build must include)
- Parameterized SQL only (prepared statements).
- Zod rejects malformed/oversized input before the stores.
- Generic auth errors (don't reveal whether an email exists).
- CORS same-origin in prod; explicit origin in dev only.
- `@fastify/rate-limit` on auth endpoints; `@fastify/helmet` headers.
- No secrets in the client bundle except the public Maps browser key.

## v1 deliberately excludes
Refresh tokens / server-side revocation (`sessions` table stubbed), OAuth/Google.
See [open-questions.md](open-questions.md), [decisions.md](decisions.md).
