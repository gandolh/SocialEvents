# Task 19: Escape the mail HTML and bound the weather call

**Depends on:** brief 17 (the server in the code structure: the files below are its `features/` layout).

Promotes two todos of 2026-11-10: the invite mail's unescaped HTML and the weather call's missing timeout and plain HTTP.

## Context

- **Mail HTML.** `server/src/features/events/service.ts:60-68` builds the invite by string interpolation: the invitee's name, the event's name, place, host name and description go in as typed. `server/src/features/auth/service.ts:24-27` does the same with the new user's name and email in the welcome mail. Markup in an event name or description reaches every invitee's inbox from the app's own address. The subject also carries the event name, so a name with a line break could inject a header (nodemailer folds most, but the subject should be single-line by our own rule).
- **Weather.** `server/src/features/integrations/weather.ts:35` fetches `http://api.weatherstack.com/current` with no timeout. A slow provider holds `GET /api/weather` open. Errors already fall back to the mock, so a timeout only has to throw.
- **Plain HTTP.** Weatherstack's free plan serves HTTP only; HTTPS is a paid-plan feature. The app runs on the free plan, so the URL stays HTTP and the reason is recorded (the todo allows this). No HTTPS endpoint is invented. The key travels in the query string; this is the known cost of the free plan, written in `wiki/integrations.md`.

## Files you OWN

- `server/src/lib/html.ts` (new) and `server/src/lib/html.test.ts` (new)
- `server/src/features/events/service.ts`, `server/src/features/auth/service.ts`
- `server/src/features/events/routes.test.ts` or a new `service.test.ts` beside it
- `server/src/features/integrations/weather.ts` and `weather.test.ts`
- `corpus/wiki/integrations.md`, `corpus/log.md`, this brief

## Files you must NOT touch

Everything else: `client/`, `shared/`, `vendor/`, configs, other features, lockfiles. No `.env` is read; `WEATHER_API_KEY` and `SMTP_HOST` stay empty and nothing calls out (tests stub `fetch`).

## What to do

1. `lib/html.ts`: `escapeHtml(value)` replacing `& < > " '`, and `singleLine(value)` replacing every CR/LF run with one space and trimming. Use `escapeHtml` on every interpolated user value in both mails (name, event name, location label, host name, description, email, and the date string too, for uniformity). Use `singleLine` on the invite subject (and the event name in it).
2. Weather: a `FETCH_TIMEOUT_MS` of 5000, passed as `signal: AbortSignal.timeout(...)` to `fetch`; `createWeather(settings, options?)` accepts `{ timeoutMs }` so a test can use a short one. Keep the HTTP URL with a comment giving the reason.
3. Tests: `escapeHtml` and `singleLine` units; an event created through the app with a hostile name and description, invitees named with markup, a stub mailer capturing the body and subject, asserting the markup arrives as text and the subject has no CR/LF; a weather test with a stubbed global `fetch` that never resolves until aborted, with a key set, asserting `get()` resolves with the mock result well inside a second, and that the signal passed was an `AbortSignal`.
4. `wiki/integrations.md`: record the HTTP-on-free-plan decision, the 5 s timeout and the escaping rule.

## Acceptance

- Every interpolated value in outgoing mail HTML goes through `escapeHtml`; the subject has no CR/LF; the tests above pass.
- The weather call aborts after the timeout and the route still returns the mock; the HTTP choice and its reason are in this brief's outcome note and the wiki.
- `npm run check` and `bash corpus/lint.sh` exit 0.
