---
title: The weather call is plain HTTP with no timeout
created: 2026-11-10
status: open
tags: [server]
---

# The weather call is plain HTTP with no timeout

Found on 2026-11-10 while writing brief 17. `server/src/weather/index.ts:36`
calls `http://api.weatherstack.com` over plain HTTP, so the API key travels in
the clear, and the request has no timeout, so a slow upstream holds the
request open.

## Acceptance

The call uses HTTPS if the provider's plan allows it (otherwise the reason is
recorded here), it aborts after a set timeout with `AbortSignal.timeout`, and a
test covers the timeout path.
