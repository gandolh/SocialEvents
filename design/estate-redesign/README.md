# The redesign: "The open invitation"

This folder is the design record of SocialEvents's redesign. The estate redesign board, where it was drawn and approved, is a private canvas; this is a copy of the app's page on it plus the build behind that page. The owner approved it on 2026-11-13, and [brief 18](../../corpus/briefs/done/18-a-redesign-with-hallmark-on-the-estate-board.md) built it. The code is now the source of truth: where the app and these files differ, the app wins, and later work may have moved a screen on. Read this folder to see what was decided and why before reshaping a screen.

## The owner's decisions

The owner approved the whole board on 2026-11-13, with every question standing at what the board proposed unless they reopened it. The questions this app's page asked:

- **Ask:** 1. Reopened: the sidebar and the Month/Day/List/Map row become one row of places on the top bar, with Month | Day in the month's head and, on a phone, a bottom bar in place of the drawer. Welcome? 2. Aero stays in both themes (glass only on the bars, text on opaque islands). Keep Aero, or open a plain, non-glass variant on the board? 3. Approve The open invitation as SocialEvents' direction?
- **Reopened:** Recorded (decisions.md, "Visual theme"): "Stitch layout/IA preserved; only the skin changed", with design-system.md's 280 px sidebar and the Month/Day/List/Map switcher; and (brief 16) "The phone menu is a Drawer". Proposed: places (Calendar, All Events, Map) as top tabs, List and Map folded into All Events and Map, Month | Day in the month's head, and on a phone a bottom bar and no drawer. Month | Day and the bar are router links, so no new Base UI part.

Where the files below disagree, the later layer wins: the owner's decisions, then the controller's rulings, then the judges' rulings, then the directions file.

## What is here

| Path | What it holds |
|---|---|
| `directions/SocialEvents.md` | The director's brief: both directions (the winner is the one built), the shared fixture and the screens to draw. |
| `judge/SocialEvents/RESULT.md` | The blind judging against today and the rulings that came with the win. |
| `critiques/SocialEvents-controller.md`, `critiques/SocialEvents.md` | The design critic's review against today, and the controller's rulings over it. |
| `manifests/SocialEvents.tokens.css`, `manifests/SocialEvents.tokens-map.md` | The token hand-off in the app's own names, and the renamed, new and unused tokens. |
| `manifests/SocialEvents.board-notes.md` | What the board said beside the screens: the asks, decisions, reopened rules, open questions, the contrast table and the runner-up. |
| `work/SocialEvents/twins/*.html` | Each drawn screen as static HTML, light and dark: open one in a browser. |
| `work/SocialEvents/shots/` | The twins rendered at 1280 and 390, light and dark, WebP. `direction.webp` is the board's direction sheet. |
| `shots/SocialEvents/` | Today's screens as the board showed them before the redesign. |

People's names and data in the pictures come from seeded demo accounts or are invented.

## Not here

The sketches and the judges' images, the runner-up's build (its notes are in the board's notes), the build's scripts, and the screenshots taken while it was built. They stay in the estate build folder.
