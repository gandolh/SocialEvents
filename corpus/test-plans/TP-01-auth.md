# TP-01 — Authentication

Run setup & fixtures: [../../playwright/README.md](../../playwright/README.md).

## Goal
Verify login/register/logout, route gating, and error handling.

## Cases
1. **Unauthenticated landing** — visiting `/` while logged out shows the
   login/register card, not the app shell.
2. **Login (valid)** — log in as `admin@socialevents.local` / `password123`;
   lands in the app (calendar). Avatar shows initials "AA".
3. **Login (invalid)** — wrong password shows a generic "Invalid email or
   password" error; does not reveal whether the email exists.
4. **Register** — switch to Register, create a new account (unique email); lands
   logged in. Re-registering the same email shows "already registered".
5. **Validation** — empty name / bad email / short (<8) password is rejected
   before submit or with a 400-driven error.
6. **Logout** — via the avatar menu → Sign out returns to the login card; the
   session cookie is cleared (revisiting `/` shows login).
7. **Admin nav visibility** — the "Admin" sidebar link appears for admin, is
   absent for a normal user (e.g. `alex@`).

## Pass criteria
All cases behave as described; no console errors beyond the benign favicon 404.
