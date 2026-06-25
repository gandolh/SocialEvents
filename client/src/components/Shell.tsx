import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  IoCalendarOutline,
  IoListOutline,
  IoMapOutline,
  IoShieldCheckmarkOutline,
  IoAdd,
  IoNotificationsOutline,
  IoMenu,
  IoClose,
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setDrawerOpen(false);
  }, [path]);

  // Close the drawer on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const sidebarContent = (
    <>
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
                  ? "aero-gloss-light text-primary border border-white/70"
                  : "text-on-surface-variant hover:bg-white/40",
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      {/* Sidebar — fixed on desktop (lg+) */}
      <aside className="aero-glass hidden w-[280px] shrink-0 flex-col rounded-none border-y-0 border-l-0 px-4 py-6 lg:flex">
        {sidebarContent}
        <div className="mt-auto" />
      </aside>

      {/* Mobile drawer (below lg) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="aero-glass-strong absolute left-0 top-0 flex h-full w-[280px] max-w-[80vw] flex-col rounded-none px-4 py-6">
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 rounded-full p-1 text-on-surface-variant hover:bg-surface-container"
            >
              <IoClose size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="aero-glass flex h-16 shrink-0 items-center justify-between gap-2 rounded-none border-x-0 border-t-0 px-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-1">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container lg:hidden"
            >
              <IoMenu size={22} />
            </button>
            <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
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
                      "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
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
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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

        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>

      {createOpen && (
        <CreateEventModal open={createOpen} onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
}
