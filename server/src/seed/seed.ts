import { runMigrations } from "../db/migrate.js";
import { getDb } from "../db/connection.js";
import { usersRepo } from "../dal/users.js";
import { departmentsRepo } from "../dal/departments.js";
import { eventsRepo } from "../dal/events.js";
import { eventRatingsRepo, hostRatingsRepo } from "../dal/ratings.js";
import { notificationsRepo } from "../dal/notifications.js";
import { hashPassword } from "../auth/password.js";

const PASSWORD = "password123";

async function seed(): Promise<void> {
  runMigrations();
  const db = getDb();

  const userCount = db.prepare("SELECT COUNT(*) AS n FROM users").get() as {
    n: number;
  };
  if (userCount.n > 0) {
    // eslint-disable-next-line no-console
    console.log("[seed] users already exist — skipping to avoid duplicates");
    return;
  }

  const hash = await hashPassword(PASSWORD);

  const engineering = departmentsRepo.create("Engineering");
  const design = departmentsRepo.create("Design");
  const marketing = departmentsRepo.create("Marketing");

  const admin = usersRepo.create({
    name: "Ada Admin",
    email: "admin@socialevents.local",
    passwordHash: hash,
    role: "admin",
    departmentId: engineering.id,
  });

  const alex = usersRepo.create({
    name: "Alex Engineer",
    email: "alex@socialevents.local",
    passwordHash: hash,
    departmentId: engineering.id,
  });
  const dana = usersRepo.create({
    name: "Dana Designer",
    email: "dana@socialevents.local",
    passwordHash: hash,
    departmentId: design.id,
  });
  const max = usersRepo.create({
    name: "Max Marketer",
    email: "max@socialevents.local",
    passwordHash: hash,
    departmentId: marketing.id,
  });
  const guest = usersRepo.create({
    name: "Sam Guest",
    email: "sam@socialevents.local",
    passwordHash: hash,
  });

  const events = [
    {
      name: "Weekly Board Games",
      host: alex,
      startsAt: "2026-07-02T17:00:00+00:00",
      category: "Game night" as const,
      description: "Bring your favorite board game.",
      location: { label: "The Cave (Room C)", lat: 45.76, lng: 21.23 },
      attendees: [dana.id, max.id],
    },
    {
      name: "Q3 Team Offsite",
      host: admin,
      startsAt: "2026-07-16T09:00:00+00:00",
      category: "Team building" as const,
      description: "Full-day strategy + activities.",
      location: { label: "Lakeside Resort", lat: 45.7, lng: 21.0 },
      attendees: [alex.id, dana.id, max.id],
    },
    {
      name: "Halloween Mixer",
      host: dana,
      startsAt: "2026-10-28T19:00:00+00:00",
      category: "Holiday" as const,
      description: "Costumes encouraged!",
      location: { label: "Rooftop Bar", lat: 45.755, lng: 21.225 },
      attendees: [admin.id, alex.id, max.id, guest.id],
    },
    {
      name: "New Hire Welcome",
      host: max,
      startsAt: "2026-07-10T15:00:00+00:00",
      category: "Other" as const,
      description: "Say hi to the new folks.",
      location: { label: "Main Auditorium", lat: 45.758, lng: 21.228 },
      attendees: [alex.id, dana.id],
    },
  ];

  for (const e of events) {
    const created = eventsRepo.create({
      name: e.name,
      hostId: e.host.id,
      startsAt: e.startsAt,
      description: e.description,
      category: e.category,
      location: e.location,
      attendeeUserIds: e.attendees,
    });
    notificationsRepo.createMany(
      e.attendees,
      `You were invited to "${created.name}"`,
    );
  }

  // A couple of ratings.
  const allEvents = eventsRepo.list();
  if (allEvents[0]) {
    eventRatingsRepo.set(allEvents[0].id, dana.id, 5);
    eventRatingsRepo.set(allEvents[0].id, max.id, 4);
  }
  hostRatingsRepo.set(alex.id, dana.id, 5);
  hostRatingsRepo.set(admin.id, alex.id, 4);

  // eslint-disable-next-line no-console
  console.log(
    `[seed] created 3 departments, 5 users, ${events.length} events.\n` +
      `[seed] login with any of: admin@/alex@/dana@/max@/sam@socialevents.local  (password: ${PASSWORD})`,
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
