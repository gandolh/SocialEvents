import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  IoCalendarOutline,
  IoListOutline,
  IoMapOutline,
  IoShieldCheckmarkOutline,
  IoAdd,
  IoNotificationsOutline,
} from "react-icons/io5";
import { useMe } from "../api/hooks.js";
import { Avatar, Button } from "./ui/index.js";
import { NotificationsMenu } from "./NotificationsMenu.js";
import { AccountMenu } from "./AccountMenu.js";
import { CreateEventModal } from "./CreateEventModal.js";
import { cn } from "../lib/utils.js";

const nav = [
  { to: "/calendar", label: "Calendar", icon: IoCalendarOutline },
  { to: "/events", label: "All Events", icon: IoListOutline },
  { to: "/map", label: "Map", icon: IoMapOutline },
  { to: "/admin", label: "Admin", icon: IoShieldCheckmarkOutline, adminOnly: true },
];

const views = [
  { to: "/calendar", label: "Month" },
  { to: "/calendar/day", label: "Day" },
  { to: "/events", label: "List" },
  { to: "/map", label: "Map" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { data: me } = useMe();
  const [createOpen, setCreateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      {/* Sidebar */}
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-outline-variant/60 bg-surface-container-low px-4 py-6">
        <div className="px-2">
          <h1 className="text-xl font-bold text-primary">SocialEvents</h1>
          <p className="text-xs text-on-surface-variant">Internal Coordination</p>
        </div>

        <div className="mt-6">
          <Button className="w-full" onClick={() => setCreateOpen(true)}>
            <IoAdd size={18} /> Create Event
          </Button>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {nav.map((item) => {
            if (item.adminOnly && me?.role !== "admin") return null;
            const active = path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container",
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto" />
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant/60 bg-surface px-6">
          <nav className="flex items-center gap-1">
            {views.map((v) => {
              const active =
                v.to === "/calendar"
                  ? path === "/calendar"
                  : path.startsWith(v.to);
              return (
                <Link
                  key={v.label}
                  to={v.to}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "text-primary underline underline-offset-8 decoration-2"
                      : "text-on-surface-variant hover:text-on-surface",
                  )}
                >
                  {v.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container"
                aria-label="Notifications"
              >
                <IoNotificationsOutline size={20} />
              </button>
              {notifOpen && <NotificationsMenu onClose={() => setNotifOpen(false)} />}
            </div>
            <div className="relative">
              <button onClick={() => setAccountOpen((o) => !o)} aria-label="Account">
                <Avatar name={me?.name ?? "?"} />
              </button>
              {accountOpen && <AccountMenu onClose={() => setAccountOpen(false)} />}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {createOpen && (
        <CreateEventModal open={createOpen} onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}
