# Task 04 — Auth (self-made)

## Files you OWN
server/src/auth/* (password, jwt, cookie, guards)

## What to do
bcrypt (cost 12) hash/verify; HS256 JWT sign/verify (7d); httpOnly+SameSite=Lax
+Secure(prod) cookie; requireAuth/requireAdmin guards + request.user decoration;
host-or-admin enforced in event service.

## Acceptance
Round-trip JWT; tampered tokens rejected; 401/403 enforced via HTTP tests.

---
## Outcome (2026-06-25)
Shipped. Tests cover hash/verify, JWT round-trip + tamper rejection, 401/403,
generic login error, host-ownership + admin-override on event delete.
