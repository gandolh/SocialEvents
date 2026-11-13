import { useMe, useLogout } from "../api/hooks.js";
import { Avatar } from "./ui/index.js";
import { Menu, MenuItem } from "./ui/Menu.js";

/** The avatar button and its menu. "Profile & settings" is the caller's dialog, so it outlives the menu. */
export function AccountMenu({ onOpenProfile }: { onOpenProfile: () => void }) {
  const { data: me } = useMe();
  const logout = useLogout();

  return (
    <Menu
      className="w-56"
      trigger={
        <button
          aria-label="Account"
          className="size-12 rounded-full outline-none focus-visible:aero-focus max-[379px]:size-11 md:size-11"
        >
          <Avatar name={me?.name ?? "?"} />
        </button>
      }
    >
      <div className="border-b border-outline-variant/60 px-4 py-3">
        <p className="text-sm font-semibold text-on-surface">{me?.name}</p>
        <p className="truncate text-xs text-on-surface-variant">{me?.email}</p>
      </div>
      <MenuItem onClick={onOpenProfile}>Profile & settings</MenuItem>
      <MenuItem danger onClick={() => logout.mutate()}>
        Sign out
      </MenuItem>
    </Menu>
  );
}
