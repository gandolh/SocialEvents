import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { IoCalendarOutline, IoListOutline, IoMapOutline, IoShieldCheckmarkOutline, IoAdd } from "react-icons/io5";
import { useMe } from "../api/hooks.js";
import { Button } from "./ui/index.js";
import { NotificationsMenu } from "./NotificationsMenu.js";
import { AccountMenu } from "./AccountMenu.js";
import { CreateEventModal } from "./CreateEventModal.js";
import { ProfileModal } from "./ProfileModal.js";
import { ViewSwitch } from "./ViewSwitch.js";
import { cn } from "../lib/cn.js";

const places = [
  { to: "/calendar", label: "Calendar", icon: IoCalendarOutline },
  { to: "/events", label: "All Events", icon: IoListOutline },
  { to: "/map", label: "Map", icon: IoMapOutline },
  { to: "/admin", label: "Admin", icon: IoShieldCheckmarkOutline, adminOnly: true },
] as const;

/**
 * The frame: a glass top bar with the places as tabs, and on a phone a glass bottom bar with the places and
 * Create Event. Month | Day sits in the month's head on a desktop, and in the top bar on a phone, on Calendar
 * only. The page scrolls under the bars; nothing floats.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const { data: me } = useMe();
  const [createOpen, setCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const onCalendar = path === "/" || path.startsWith("/calendar");
  const visible = places.filter((place) => !("adminOnly" in place) || me?.role === "admin");
  const isActive = (to: string) => (to === "/calendar" ? onCalendar : path.startsWith(to));

  return (
    <div className="flex min-h-dvh flex-col bg-background text-on-surface">
      <header className="sticky top-0 z-sticky flex h-14 shrink-0 items-center gap-2 border-b border-outline px-3 aero-bar max-[379px]:px-2 md:h-topbar md:gap-7 md:px-6">
        <div className="flex min-w-0 flex-col justify-center">
          <span className="font-display text-[18px]/6 font-semibold text-primary max-[379px]:text-base md:text-title">
            SocialEvents
          </span>
          <span className="hidden text-label text-on-surface-variant md:block">Internal Coordination</span>
        </div>

        <nav aria-label="Places" className="hidden self-stretch md:flex md:gap-1">
          {visible.map((place) => {
            const active = isActive(place.to);
            return (
              <Link
                key={place.to}
                to={place.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "mt-[3px] flex items-center gap-2 border-b-[3px] px-2.5 font-medium outline-none focus-visible:aero-focus lg:px-4",
                  active
                    ? "border-primary font-semibold text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface",
                )}
              >
                <place.icon size={20} aria-hidden="true" />
                {place.label}
              </Link>
            );
          })}
        </nav>

        {onCalendar && <ViewSwitch day={path.startsWith("/calendar/day")} className="ml-auto md:hidden" />}

        <div className={cn("flex items-center gap-0.5 md:ml-auto md:gap-3", !onCalendar && "ml-auto")}>
          <Button
            size="bar"
            aria-label="Create Event"
            className="hidden max-lg:w-11 max-lg:px-0 md:inline-flex"
            onClick={() => setCreateOpen(true)}
          >
            <IoAdd size={18} aria-hidden="true" />
            <span className="max-lg:hidden">Create Event</span>
          </Button>
          <NotificationsMenu />
          <AccountMenu onOpenProfile={() => setProfileOpen(true)} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-2.5 px-3 pt-3 pb-4 min-[1200px]:px-8 md:gap-3 md:px-4">
        {children}
      </main>

      <div className="sticky bottom-0 z-sticky flex h-[calc(64px+env(safe-area-inset-bottom))] border-t border-outline pb-[env(safe-area-inset-bottom)] aero-bar md:hidden">
        <nav aria-label="Places" className="flex min-w-0 flex-1">
          {visible.map((place) => {
            const active = isActive(place.to);
            return (
              <Link
                key={place.to}
                to={place.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-label whitespace-nowrap outline-none focus-visible:aero-focus",
                  active ? "font-bold text-primary" : "font-medium text-on-surface-variant",
                )}
              >
                <place.icon size={22} aria-hidden="true" />
                {place.label}
              </Link>
            );
          })}
        </nav>
        <Button
          className="mt-2 mr-3 ml-1 h-12 shrink-0 self-start px-3.5 max-[379px]:px-2.5 max-[379px]:text-label"
          onClick={() => setCreateOpen(true)}
        >
          <IoAdd size={18} aria-hidden="true" className="max-[379px]:hidden" />
          Create Event
        </Button>
      </div>

      {profileOpen && <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />}
      {createOpen && <CreateEventModal open={createOpen} onClose={() => setCreateOpen(false)} />}
    </div>
  );
}
