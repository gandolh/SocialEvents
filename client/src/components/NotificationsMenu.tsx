import { useNotifications, useMarkNotification, useDeleteNotification } from "../api/hooks.js";
import { formatDateTime, cn } from "../lib/utils.js";
import { IoTrashOutline } from "react-icons/io5";

export function NotificationsMenu({ onClose }: { onClose: () => void }) {
  const { data: notifications = [] } = useNotifications();
  const mark = useMarkNotification();
  const del = useDeleteNotification();

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-outline-variant/60 bg-surface-container-lowest shadow-lg">
        <div className="border-b border-outline-variant/60 px-4 py-3 text-sm font-semibold">
          Notifications
        </div>
        <div className="max-h-96 overflow-auto">
          {notifications.length === 0 && (
            <p className="p-6 text-center text-sm text-on-surface-variant">
              You're all caught up.
            </p>
          )}
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-2 border-b border-outline-variant/40 px-4 py-3 text-sm last:border-0",
                !n.read && "bg-primary/5",
              )}
            >
              <button
                className="flex-1 text-left"
                onClick={() => !n.read && mark.mutate({ id: n.id, read: true })}
              >
                {!n.read && (
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
                )}
                <span className="text-on-surface">{n.message}</span>
                <span className="mt-0.5 block text-xs text-on-surface-variant">
                  {formatDateTime(n.createdAt)}
                </span>
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
      </div>
    </>
  );
}
