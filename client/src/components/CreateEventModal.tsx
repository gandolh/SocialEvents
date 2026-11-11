import { useState } from "react";
import { EVENT_CATEGORY_NAMES } from "@socialevents/shared";
import { useCreateEvent, useDepartments, useUsers, useMe } from "../api/hooks.js";
import { Dialog, Input, Textarea, Select, Button } from "./ui/index.js";
import { Tab, TabPanel, Tabs, TabsList } from "./ui/Tabs.js";

export function CreateEventModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateEvent();
  const { data: me } = useMe();
  const { data: departments = [] } = useDepartments();
  const { data: users = [] } = useUsers();

  const [name, setName] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [category, setCategory] = useState<string>("Other");
  const [description, setDescription] = useState("");
  const [locLabel, setLocLabel] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedDepts, setSelectedDepts] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"people" | "departments">("people");
  const [err, setErr] = useState<string | null>(null);

  const toggle = (set: Set<string>, id: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  const submit = async () => {
    setErr(null);
    if (!name || !startsAt || !locLabel) {
      setErr("Name, date and location are required.");
      return;
    }
    try {
      await create.mutateAsync({
        name,
        startsAt: new Date(startsAt).toISOString(),
        description,
        category,
        location: {
          label: locLabel,
          lat: lat ? Number(lat) : null,
          lng: lng ? Number(lng) : null,
        },
        attendeeUserIds: [...selectedUsers],
        attendeeDepartmentIds: [...selectedDepts],
      });
      onClose();
    } catch (e) {
      setErr((e as Error).message || "Could not create event.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create event"
      size="lg"
      dismissOnBackdrop={false}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} disabled={create.isPending}>
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input data-autofocus label="Event name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date & time"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
          <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {EVENT_CATEGORY_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <Input
          label="Location"
          placeholder="e.g. Main Auditorium"
          value={locLabel}
          onChange={(e) => setLocLabel(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Latitude (optional)" value={lat} onChange={(e) => setLat(e.target.value)} />
          <Input label="Longitude (optional)" value={lng} onChange={(e) => setLng(e.target.value)} />
        </div>
        <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        {/* Attendees */}
        <div>
          <span className="mb-1 block text-sm font-medium text-on-surface-variant">Invite</span>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <Tab value="people">People</Tab>
              <Tab value="departments">Departments</Tab>
            </TabsList>
            <TabPanel className="max-h-40 overflow-auto rounded-lg border border-outline-variant/60 p-2" value="people">
              {users
                .filter((u) => u.id !== me?.id)
                .map((u) => (
                  <label key={u.id} className="flex items-center gap-2 px-1 py-1 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(u.id)}
                      onChange={() => toggle(selectedUsers, u.id, setSelectedUsers)}
                    />
                    {u.name} <span className="text-xs text-on-surface-variant">{u.email}</span>
                  </label>
                ))}
            </TabPanel>
            <TabPanel
              className="max-h-40 overflow-auto rounded-lg border border-outline-variant/60 p-2"
              value="departments"
            >
              {departments.map((d) => (
                <label key={d.id} className="flex items-center gap-2 px-1 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedDepts.has(d.id)}
                    onChange={() => toggle(selectedDepts, d.id, setSelectedDepts)}
                  />
                  {d.name}
                </label>
              ))}
            </TabPanel>
          </Tabs>
        </div>

        {err && <p className="text-sm text-error">{err}</p>}
      </div>
    </Dialog>
  );
}
