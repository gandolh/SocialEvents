# SocialEvents: the controller's rulings on the critique (2026-11-13)

They override the critic (`SocialEvents.md`) where they differ. Everything else in the critique stands.

1. **360 density: take all three moves.** The key on one line, the `In November` head at 17/24, and under 380 px the chip on the name line (grid, row gap 0, rows back to 56 px). Together with the 48 px controls (ruling 5), one whole In November row clears the bar at 360x800 and two at 390x844. Measure and report both.
2. **The month keeps six rows,** as today, whatever the month needs: a grid whose height jumps between months is worse than 45 px. No owner sticky. Add a Note sticky that the 1280 "whole month above the fold" holds for the fixture, and that a day with two events pushes the sixth row lower (honest, not hidden).
3. **Dialogs: draw them as the build will be.** Replace the `filter: brightness()` dim with a scrim layer (`--color-scrim`) and `backdrop-filter: blur(8px)`, as today's `Dialog.tsx` and design-system.md record. The dimmed page stays `aria-hidden`; the gate-73 ruling still applies. Say in the tokens map that the build keeps Base UI's Backdrop.
4. **Selected segments are not buttons.** Month / Day and People (and any segmented control) show the selected option as a surface pill with a 1 px `line-strong` edge and accent text at 600. The solid accent fill is only for the one primary action per screen.
5. **Stars stay buttons** (decisions.md). Five 48 px targets; on phones the stars take their own row in the sheet so nothing overflows at 360. Isolated controls go to 48 px for Android; day cells stay 44 px.
6. **Today's cell:** drop the 3 px accent stripe, keep the disc.
7. **The builder's changes:** Create Event in the phone bottom bar holds (48 px tall, and fits with an Admin tab); Month | Day in the phone top bar holds, hidden on All Events and Map (a Decision sticky says so); the key under the grid holds with ruling 1.
8. **The 768 dialog renders** end in a 224 px white band: fix the render rig, then re-shoot.
9. Re-run every Floor check from scratch, and report the first-screen table at 1280x800, 390x844 and 360x800.

## Round 3 (controller's look, 2026-11-13)

1. **The host's rating came loose on phones.** In the event sheet at 390 and 360, the host's five stars float as an unlabelled row under `Ada Admin`, indented into the value column, and `4.0 (1)` wraps (to two lines at 390, onto its own line at 360). Today it sits right after the host's name. Fix: on phones the host's stars sit directly under the Host row with no extra gap, starting at the label column so the row has the sheet's full inner width: five 48 px star buttons and then `4.0 (1)` on the same line, never wrapped. Same pattern for the event's own rating row under the badge (`0.0 (0)` on the stars' line). Check 390 and 360 in both themes; no new visible copy.
2. Re-run the Floor and re-shoot the event-detail twins.
