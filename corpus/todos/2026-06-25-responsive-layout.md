---
title: Responsive layout (sidebar collapse on mobile/tablet)
created: 2026-06-25
status: done
tags: [ui, responsive, audit]
---

# Responsive layout (sidebar collapse on mobile/tablet)

The app is currently desktop-only. At ~600px the fixed 280px sidebar remains and
the top-bar avatar is clipped off the right edge.

## Context
Found in the TP-06 UI audit (finding F1) — see
[../test-plans/RESULTS.md](../test-plans/RESULTS.md). The design system specifies
responsive behavior: see [../wiki/design-system.md](../wiki/design-system.md) —
mobile (<600px) sidebars → bottom sheets; tablet (600–1024px) → icon-only rails;
desktop (>1024px) full layout.

## Acceptance
At mobile/tablet widths the shell stays usable: sidebar collapses (drawer/bottom
sheet or icon rail), top bar fits, no clipped controls.

Promoted to [Brief 12](../briefs/todo/12-responsive-layout.md).

Resolved 2026-06-25 — see [Brief 12](../briefs/done/12-responsive-layout.md).
