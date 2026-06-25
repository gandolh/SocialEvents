import { useState } from "react";
import { useMe, useLogout } from "../api/hooks.js";
import { ProfileModal } from "./ProfileModal.js";

export function AccountMenu({ onClose }: { onClose: () => void }) {
  const { data: me } = useMe();
  const logout = useLogout();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-outline-variant/60 bg-surface-container-lowest shadow-lg">
        <div className="border-b border-outline-variant/60 px-4 py-3">
          <p className="text-sm font-semibold text-on-surface">{me?.name}</p>
          <p className="truncate text-xs text-on-surface-variant">{me?.email}</p>
        </div>
        <button
          className="block w-full px-4 py-2 text-left text-sm hover:bg-surface-container"
          onClick={() => {
            setProfileOpen(true);
          }}
        >
          Profile & settings
        </button>
        <button
          className="block w-full px-4 py-2 text-left text-sm text-error hover:bg-surface-container"
          onClick={() => logout.mutate()}
        >
          Sign out
        </button>
      </div>
      {profileOpen && (
        <ProfileModal
          open={profileOpen}
          onClose={() => {
            setProfileOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
