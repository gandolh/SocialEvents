import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { Shell } from "./components/Shell.js";
import { CalendarMonth } from "./routes/CalendarMonth.js";
import { CalendarDay } from "./routes/CalendarDay.js";
import { AllEvents } from "./routes/AllEvents.js";
import { MapPage } from "./routes/MapPage.js";
import { AdminPage } from "./routes/AdminPage.js";

const rootRoute = createRootRoute({
  component: () => (
    <Shell>
      <Outlet />
    </Shell>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: CalendarMonth,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: CalendarMonth,
});

const calendarDayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar/day",
  component: CalendarDay,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: AllEvents,
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map",
  component: MapPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  calendarRoute,
  calendarDayRoute,
  eventsRoute,
  mapRoute,
  adminRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
