import { useNotifications, useMarkNotification, useDeleteNotification } from "../api/hooks.js";
import { cn } from "../lib/cn.js";
import { formatDateTime } from "../lib/utils.js";
import { IoNotificationsOutline, IoTrashOutline } from "react-icons/io5";
import { Popover } from "./ui/Popover.js";

/** The bell button and its panel of notifications. */
export function NotificationsMenu() {
  const { data: notifications = [] } = useNotifications();
  const mark = useMarkNotification();
  const del = useDeleteNotification();

  return (
    <Popover
      className="w-80"
      title="Notifications"
      trigger={
        <button
          className="rounded-full p-2 text-on-surface-variant outline-none hover:bg-surface-container focus-visible:aero-glow"
          aria-label="Notifications"
        >
          <IoNotificationsOutline size={20} />
        </button>
      }
    >
      <div className="max-h-96 overflow-auto">
        {notifications.length === 0 && (
          <p className="p-6 text-center text-sm text-on-surface-variant">You're all caught up.</p>
        )}
        {notifications.map((n) => (
          <div
            key={n.id}
            className={cn(
              "flex items-start gap-2 border-b border-outline-variant/40 px-4 py-3 text-sm last:border-0",
              !n.read && "bg-primary/5",
            )}
          >
            <button className="flex-1 text-left" onClick={() => !n.read && mark.mutate({ id: n.id, read: true })}>
              {!n.read && <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary align-middle" />}
              <span className="text-on-surface">{n.message}</span>
              <span className="mt-0.5 block text-xs text-on-surface-variant">{formatDateTime(n.createdAt)}</span>
            </button>
            <button
              onClick={() => del.mutate(n.id)}
              className="text-on-surface-variant hover:text-error"
              aria-label="Dismiss"
            >
              <IoTrashOutline size={16} />
            </button>
          </div>
        ))}
      </div>
    </Popover>
  );
}
