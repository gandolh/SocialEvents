import { useState } from "react";
import { useMe, useUpdateProfile, useChangePassword } from "../api/hooks.js";
import { Modal, Input, Button } from "./ui/index.js";

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: me } = useMe();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const [name, setName] = useState(me?.name ?? "");
  const [jobTitle, setJobTitle] = useState(me?.jobTitle ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const saveProfile = async () => {
    setMsg(null);
    setErr(null);
    try {
      await updateProfile.mutateAsync({ name, jobTitle: jobTitle || null });
      setMsg("Profile updated.");
    } catch {
      setErr("Could not update profile.");
    }
  };

  const savePassword = async () => {
    setMsg(null);
    setErr(null);
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setMsg("Password changed.");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setErr("Current password is incorrect.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Profile & settings">
      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-on-surface">Profile</h3>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Button size="sm" onClick={saveProfile} disabled={updateProfile.isPending}>
            Save profile
          </Button>
        </section>

        <section className="space-y-3 border-t border-outline-variant/60 pt-4">
          <h3 className="text-sm font-semibold text-on-surface">Change password</h3>
          <Input
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            size="sm"
            onClick={savePassword}
            disabled={changePassword.isPending || !currentPassword || newPassword.length < 8}
          >
            Change password
          </Button>
        </section>

        {msg && <p className="text-sm text-[#006d3b]">{msg}</p>}
        {err && <p className="text-sm text-error">{err}</p>}
      </div>
    </Modal>
  );
}
