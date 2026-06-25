# TP-05 — Admin

Run setup & fixtures: [../../playwright/README.md](../../playwright/README.md).

## Goal
Verify department and member management, and role gating.

## Cases
1. **Access gating** — `/admin` as a non-admin (e.g. `alex@`) shows "Admins only."
   and the Admin nav link is hidden. As admin it renders the two-pane manager.
2. **Departments list** — left pane lists seeded departments (Design, Engineering,
   Marketing); selecting one loads its members.
3. **Create department** — adding a name creates it; it appears in the list.
4. **Delete department** — deleting prompts for confirmation; members become
   unassigned (department set to none), not deleted.
5. **Add member** — search a user in the right pane and Add → they move into the
   selected department.
6. **Remove member** — Remove sets the user's department to none.

## Pass criteria
All department/member operations round-trip; non-admins are blocked client- and
server-side (server returns 403 — verified in TP-01 / route tests).
