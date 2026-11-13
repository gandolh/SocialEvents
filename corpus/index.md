# SocialEvents corpus — index

The front door. What lives where.

## Meta
- [CLAUDE.md](CLAUDE.md) — corpus rules & conventions
- [log.md](log.md) — chronological record of changes
- [routing.md](routing.md) — which skill handles which request, which layer answers which question

## Wiki (synthesis)
<!-- catalog:start -->
- [api-contract](wiki/api-contract.md): The REST endpoints under /api, who may call each one, and what they return
- [architecture](wiki/architecture.md): How the client, server and shared contract fit together, and how a request flows through them
- [auth](wiki/auth.md): The self-made sign-in: bcrypt passwords, a JWT in a cookie, and the user, owner and admin checks
- [data-model](wiki/data-model.md): The SQLite schema: departments, users, events, attendees, ratings and notifications, and how they relate
- [decisions](wiki/decisions.md): The locked tech and design choices, including the pinned versions, with the reason for each; the visual decisions reopened and changed on 2026-11-13 (brief 18) keep their old lines as history
- [design-system](wiki/design-system.md): The applied design, "The open invitation" (the ticket over the month, glass only on the bars, Lexend and Figtree, a light and a dark theme), with the Stitch source it replaced kept below
- [integrations](wiki/integrations.md): Weather, maps and email: the real service each one uses with a key, and its stand-in without one
- [open-questions](wiki/open-questions.md): The design questions that are still open, such as event cover images
- [overview](wiki/overview.md): What SocialEvents is, who uses it, where it came from and the top-level layout
- [status](wiki/status.md): A dated snapshot of where the project stands: v1 built, then Base UI, the server structure and (2026-11-13) the "open invitation" redesign; what was checked and what could come next
<!-- catalog:end -->

## Work
- [briefs/todo/](briefs/todo/) — ready-to-build specs
- [briefs/done/](briefs/done/) — completed (immutable)
- [briefs/superseded/](briefs/superseded/) — replaced (immutable)
- [todos/](todos/) — captured ideas (pre-spec)
- `bash corpus/lint.sh` — health check; `--index` regenerates the wiki catalog above

## Test plans (what to test) + UI testing (how)
- [test-plans/index.md](test-plans/index.md) — plain-text UI test plans (TP-01…06)
- [test-plans/RESULTS.md](test-plans/RESULTS.md) — latest audit run
- [../playwright/README.md](../playwright/README.md) — test server bring-up, fixtures, conventions

## Sources (human-curated inputs the wiki synthesizes from)
- [sources/SPEC.md](sources/SPEC.md) — product/architecture spec (upstream)
- [sources/stitch_design/](sources/stitch_design/) — Stitch design output (HTML/PNG + DESIGN.md)
