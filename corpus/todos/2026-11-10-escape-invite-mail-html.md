---
title: Invite emails put user text into HTML unescaped
created: 2026-11-10
status: promoted
promoted-to: briefs/todo/19-escape-invite-mail-and-bound-the-weather-call.md
tags: [security, server]
---

# Invite emails put user text into HTML unescaped

Found on 2026-11-10 while writing brief 17. The invite mail in
`server/src/services/eventService.ts:63-76` builds its HTML by string
interpolation: the invitee's name, the event's name, place, host and
description all go in as they were typed. A user who names an event
`<a href="…">Click here</a>`, or puts markup in the description, sends that
markup to every invitee's inbox from the app's own address.

## Acceptance

Every interpolated value in outgoing mail HTML is escaped (`&`, `<`, `>`,
`"`, `'`) by one helper, a test sends an event whose name and description hold
markup and asserts the mail body carries it as text, and the subject line is
stripped of line breaks.
