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
          className="grid size-12 place-items-center rounded-full text-on-surface-variant outline-none hover:bg-surface-container-high hover:text-on-surface focus-visible:aero-focus max-narrow:size-11 md:size-11"
          aria-label="Notifications"
        >
          <IoNotificationsOutline size={22} />
        </button>
      }
    >
      <div className="max-h-96 overflow-auto">
        {notifications.length === 0 && (
          <p className="p-6 text-center text-body text-on-surface-variant">You're all caught up.</p>
        )}
        {notifications.map((n) => (
          <div
            key={n.id}
            className={cn(
              "flex items-start gap-2 border-b border-outline-variant px-4 py-2 text-body last:border-0",
              !n.read && "bg-surface-container-high",
            )}
          >
            <button
              type="button"
              className="min-h-11 flex-1 cursor-pointer rounded-sm text-left outline-none focus-visible:aero-focus"
              onClick={() => !n.read && mark.mutate({ id: n.id, read: true })}
            >
              {!n.read && <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary align-middle" />}
              <span className="text-on-surface">{n.message}</span>
              <span className="mt-0.5 block text-small text-on-surface-variant">{formatDateTime(n.createdAt)}</span>
            </button>
            <button
              type="button"
              onClick={() => del.mutate(n.id)}
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-on-surface-variant outline-none hover:text-error focus-visible:aero-focus"
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
