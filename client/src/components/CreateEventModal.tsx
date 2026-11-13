import { useState } from "react";
import { EVENT_CATEGORY_NAMES } from "@socialevents/shared";
import { useCreateEvent, useDepartments, useUsers, useMe } from "../api/hooks.js";
import { Dialog, Input, Textarea, Select, Button } from "./ui/index.js";
import { Checkbox } from "./ui/Checkbox.js";
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
      size="xl"
      dismissOnBackdrop={false}
      footer={
        <>
          <Button variant="secondary" className="max-md:h-12 max-md:flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="max-md:h-12 max-md:flex-1" onClick={() => void submit()} disabled={create.isPending}>
            Create
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 max-md:gap-3.5 md:gap-3">
        <Input data-autofocus label="Event name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:gap-3.5">
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
        <div className="grid grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))] gap-4 max-md:grid-cols-2 max-md:gap-3">
          <div className="max-md:col-span-full">
            <Input
              label="Location"
              placeholder="e.g. Main Auditorium"
              value={locLabel}
              onChange={(e) => setLocLabel(e.target.value)}
            />
          </div>
          <Input label="Latitude (optional)" inputMode="decimal" value={lat} onChange={(e) => setLat(e.target.value)} />
          <Input
            label="Longitude (optional)"
            inputMode="decimal"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>
        <Textarea
          label="Description"
          rows={2}
          className="min-h-14"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Attendees */}
        <div className="flex flex-col gap-1.5">
          <span className="text-small font-semibold text-on-surface-variant">Invite</span>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <Tab value="people">People</Tab>
              <Tab value="departments">Departments</Tab>
            </TabsList>
            <TabPanel
              className="mt-1.5 max-h-44 overflow-auto rounded-md border border-outline-variant bg-surface-container-high px-3 py-1"
              value="people"
            >
              {users
                .filter((u) => u.id !== me?.id)
                .map((u) => (
                  <Checkbox
                    key={u.id}
                    className="border-outline-variant not-first:border-t"
                    checked={selectedUsers.has(u.id)}
                    onCheckedChange={() => toggle(selectedUsers, u.id, setSelectedUsers)}
                    label={
                      <>
                        <span className="font-semibold">{u.name}</span>{" "}
                        <span className="text-small [overflow-wrap:anywhere] text-on-surface-variant">{u.email}</span>
                      </>
                    }
                  />
                ))}
            </TabPanel>
            <TabPanel
              className="mt-1.5 max-h-44 overflow-auto rounded-md border border-outline-variant bg-surface-container-high px-3 py-1"
              value="departments"
            >
              {departments.map((d) => (
                <Checkbox
                  key={d.id}
                  className="border-outline-variant not-first:border-t"
                  checked={selectedDepts.has(d.id)}
                  onCheckedChange={() => toggle(selectedDepts, d.id, setSelectedDepts)}
                  label={<span className="font-semibold">{d.name}</span>}
                />
              ))}
            </TabPanel>
          </Tabs>
        </div>

        {err && (
          <p role="alert" className="text-body font-semibold text-error">
            {err}
          </p>
        )}
      </div>
    </Dialog>
  );
}
