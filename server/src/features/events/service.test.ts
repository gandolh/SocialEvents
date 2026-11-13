import { describe, expect, it } from "vitest";
import { freshDb } from "../../testing/helpers.js";
import { createDepartmentsStore } from "../departments/index.js";
import { createNotificationsStore } from "../notifications/index.js";
import { createUsersStore } from "../users/index.js";
import { createEventService } from "./service.js";
import { createEventsStore } from "./store.js";

describe("invite mail", () => {
  it("carries hostile text as text, and a subject on one line", async () => {
    const db = freshDb();
    const users = createUsersStore(db);
    const sent: { to: string; subject: string; html: string }[] = [];
    const mailer = {
      mode: "mock" as const,
      send: async (msg: { to: string; subject: string; html: string }) => {
        sent.push(msg);
      },
    };
    const host = users.create({ name: "Host <b>x</b>", email: "host@x.com", passwordHash: "h" });
    const guest = users.create({ name: `Eve "<script>alert(1)</script>"`, email: "eve@x.com", passwordHash: "h" });
    const service = createEventService({
      events: createEventsStore(db),
      departments: createDepartmentsStore(db),
      users,
      notifications: createNotificationsStore(db),
      mailer,
    });

    await service.createEvent(
      { id: host.id, role: "user" },
      {
        name: `<a href="https://evil.example">Click here</a>\r\nBcc: spy@evil.example`,
        startsAt: "2026-07-01T18:00:00+00:00",
        description: `<img src=x onerror="steal()"> & more`,
        category: "Other",
        location: { label: "<i>HQ</i>", lat: 1, lng: 2 },
        attendeeUserIds: [guest.id],
        attendeeDepartmentIds: [],
      },
    );

    expect(sent).toHaveLength(1);
    const mail = sent[0];
    if (!mail) throw new Error("no mail");
    expect(mail.subject).not.toMatch(/[\r\n]/);
    expect(mail.html).not.toMatch(/<a |<script|<img|<i>|<b>/);
    expect(mail.html).toContain("&lt;a href=&quot;https://evil.example&quot;&gt;Click here&lt;/a&gt;");
    expect(mail.html).toContain("Eve &quot;&lt;script&gt;alert(1)&lt;/script&gt;&quot;");
    expect(mail.html).toContain("&lt;img src=x onerror=&quot;steal()&quot;&gt; &amp; more");
    expect(mail.html).toContain("&lt;i&gt;HQ&lt;/i&gt;");
    expect(mail.html).toContain("Host &lt;b&gt;x&lt;/b&gt;");
  });
});
