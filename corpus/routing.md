# Routing: how work routes in this project
<!-- Read by the orchestrate skill. Tune freely, keep it short. -->

**Implement skill:** plan-split-dispatch
**Review skill:** a general-purpose agent over the diff, plus `npm run typecheck`, `npm test` and `npm run build`
**PR skill:** propose git commands; the owner pushes
**Issue tracker:** none. Findings go to `corpus/todos/`
**Code host:** GitHub, gandolh/SocialEvents, public

## Intent routing
| Signal | Intent | Route to |
|--------|--------|----------|
| New idea or finding to capture | capture | corpus-flow: add todo |
| Ready to build, 3 or more chunks | build | brief, then plan-split-dispatch |
| Ready to build, 1 or 2 files | build, small | brief, then implement inline |
| A screen to test or audit | test | `corpus/test-plans/`, `playwright/README.md`, ui-test-plans |
| UI or visual change | design | `wiki/design-system.md`, impeccable |
| README, docs/ or screenshots refresh | docs | readme-docs, then `docs/images/shots.md` |
| "what does the wiki say about X" | query | corpus-flow: query wiki |

## Knowledge routing: which layer answers which question
| Question shape | Route to |
|---|---|
| "Why is it built this way?" | [wiki/decisions.md](wiki/decisions.md) |
| "What does the product need to do?" | [sources/SPEC.md](sources/SPEC.md) |
| "Where does the work stand?" | [wiki/status.md](wiki/status.md) |
| "Which endpoint, table or check?" | [wiki/api-contract.md](wiki/api-contract.md), [wiki/data-model.md](wiki/data-model.md), [wiki/auth.md](wiki/auth.md) |
| "How do I run it?" | [../docs/getting-started.md](../docs/getting-started.md) |
| "Did I get every usage?" for a rename | `grep -rnw` |

## READ / SKIP / SKILLS
| Task type | READ | SKIP | SKILLS |
|-----------|------|------|--------|
| server | wiki/architecture.md, data-model.md, auth.md, the brief | corpus/sources/stitch_design | plan-split-dispatch |
| client | wiki/design-system.md, api-contract.md, the brief | server/src/db | impeccable, plan-split-dispatch |
| README or images | README.md, docs/, docs/images/shots.md | server and client internals | readme-docs, unslop |
