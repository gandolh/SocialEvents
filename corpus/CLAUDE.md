# Corpus conventions — SocialEvents

This `corpus/` is the project's LLM-maintained wiki + work tracker. **Read
[index.md](index.md) first** — it's the front door / catalog.

## The split
- **Human** curates sources and asks questions.
- **LLM** owns `wiki/` (synthesis), tracks work via `briefs/`, and keeps
  `index.md` + `log.md` current.

## Layout
```
corpus/
  CLAUDE.md   ← you are here (rules)
  index.md    ← catalog / front door
  log.md      ← chronological record (newest last)
  todos/      ← captured ideas as prose (pre-spec)
  briefs/     ← immutable task specs
    todo/ done/ superseded/
  wiki/       ← curated synthesis pages (the knowledge base)
```

## Rules (load-bearing)
- **Briefs are immutable** once in `done/` or `superseded/`. New work → new brief
  in `todo/`. Brief **numbers are stable** — never renumber on move.
- **LLM owns `wiki/`** — rewrite pages freely as understanding improves
  (synthesis, not append-only transcript). Every wiki page must be reachable from
  `index.md`.
- **`decisions.md` records locked choices** — don't relitigate without an explicit
  revisit + a `log.md` note.
- **Standard relative markdown links**, not `[[wikilinks]]`. Code refs from
  `wiki/` are `../../client/...` / `../../server/...`.
- **Absolute dates** (`2026-06-25`), never "yesterday".
- **One concept per file**; split a page past ~200 lines.
- Don't commit corpus changes unless the user asks.

## Source-of-truth ordering (when pages disagree)
1. The **actual code** wins over any wiki claim.
2. A brief in **`done/`** wins over `wiki/` if the wiki hasn't caught up.
3. **`decisions.md`** wins over `status.md` for tech choices not formally revisited.
4. **[sources/SPEC.md](sources/SPEC.md)** is the upstream product spec; it wins on
   product/scope intent where the wiki is silent.

Verify any path/function a page names (it may have drifted) before acting on it.
