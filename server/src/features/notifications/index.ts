// The feature's public surface: app.ts, and any other feature, import from here only.
export { createMailer, type Mailer } from "./email.js";
export { notificationRoutes } from "./routes.js";
export { createNotificationsStore, type NotificationsStore } from "./store.js";
