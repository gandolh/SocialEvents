import { useState } from "react";
import { IoTrashOutline, IoAdd } from "react-icons/io5";
import {
  useDepartments,
  useUsers,
  useCreateDepartment,
  useDeleteDepartment,
  useAssignDepartment,
  useMe,
} from "../api/hooks.js";
import { Button, Input, Skeleton, EmptyState } from "../components/ui/index.js";
import { InlineConfirm } from "../components/ui/InlineConfirm.js";
import { cn } from "../lib/cn.js";

export function AdminPage() {
  const { data: me } = useMe();
  const { data: departments = [], isLoading } = useDepartments();
  const { data: allUsers = [] } = useUsers();
  const createDept = useCreateDepartment();
  const deleteDept = useDeleteDepartment();
  const assign = useAssignDepartment();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newDept, setNewDept] = useState("");
  const [userSearch, setUserSearch] = useState("");

  if (me?.role !== "admin") {
    return (
      <div className="rounded-lg border border-outline-variant bg-surface-bright shadow-panel">
        <EmptyState message="Admins only." />
      </div>
    );
  }
  if (isLoading) {
    return (
      <div role="status" aria-label="Loading departments" className="flex flex-col gap-3 md:flex-row">
        <Skeleton className="h-56 rounded-lg md:w-80" />
        <Skeleton className="h-56 flex-1 rounded-lg" />
      </div>
    );
  }

  const selected = departments.find((d) => d.id === selectedId) ?? departments[0];
  const members = allUsers.filter((u) => u.departmentId === selected?.id);
  const nonMembers = allUsers.filter(
    (u) => u.departmentId !== selected?.id && u.name.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const island = "rounded-lg border border-outline-variant bg-surface-bright p-4 shadow-panel md:p-5";
  const row =
    "flex min-h-11 items-center justify-between gap-2 rounded-md border border-outline-variant bg-surface-bright px-3 py-1.5 text-body";

  return (
    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-start">
      {/* Departments */}
      <section aria-label="Departments" className={cn(island, "flex shrink-0 flex-col md:w-80")}>
        <h1 className="mb-3 font-display text-dialog font-medium text-on-surface">Departments</h1>
        <div className="space-y-1">
          {departments.map((d) => (
            <div
              key={d.id}
              className={cn(
                "flex min-h-11 items-center justify-between rounded-md border px-3 py-1.5",
                selected?.id === d.id
                  ? "border-outline bg-surface-container-high font-semibold text-primary"
                  : "border-transparent hover:bg-surface-container-high",
              )}
            >
              <button
                type="button"
                className="min-h-11 flex-1 cursor-pointer rounded-sm text-left text-body outline-none focus-visible:aero-focus"
                onClick={() => setSelectedId(d.id)}
              >
                {d.name}
              </button>
              <InlineConfirm
                question="Delete?"
                yesLabel={`Yes, delete department "${d.name}"; its members become unassigned`}
                onConfirm={async () => {
                  await deleteDept.mutateAsync(d.id);
                  if (selectedId === d.id) setSelectedId(null);
                }}
                trigger={(ask) => (
                  <button
                    type="button"
                    onClick={ask}
                    className="grid size-11 cursor-pointer place-items-center rounded-full text-on-surface-variant outline-none hover:text-error focus-visible:aero-focus"
                    aria-label="Delete department"
                  >
                    <IoTrashOutline size={18} aria-hidden="true" />
                  </button>
                )}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            aria-label="New department"
            placeholder="New department"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
          />
          <Button
            aria-label="Add department"
            variant="secondary"
            className="shrink-0 max-md:size-12 max-md:px-0"
            onClick={() => {
              if (newDept.trim()) {
                createDept.mutate(newDept.trim());
                setNewDept("");
              }
            }}
          >
            <IoAdd size={20} aria-hidden="true" />
          </Button>
        </div>
      </section>

      {/* Members */}
      <section aria-label="Members" className={cn(island, "flex flex-1 flex-col")}>
        <h2 className="mb-3 font-display text-dialog font-medium text-on-surface">
          {selected ? `${selected.name} — Members` : "Members"}
        </h2>
        {!selected ? (
          <EmptyState message="Create or select a department." />
        ) : (
          <div className="grid flex-1 gap-5 md:grid-cols-2 md:gap-6">
            <div className="flex flex-col">
              <p className="mb-2 text-small font-semibold text-on-surface-variant">
                Current members ({members.length})
              </p>
              <div className="space-y-1.5">
                {members.map((u) => (
                  <div key={u.id} className={row}>
                    <span>{u.name}</span>
                    <Button
                      size="sm"
                      variant="danger"
                      className="max-md:h-12"
                      onClick={() => assign.mutate({ userId: u.id, departmentId: null })}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {members.length === 0 && <p className="text-body text-on-surface-variant">No members yet.</p>}
              </div>
            </div>

            <div className="flex flex-col">
              <Input
                aria-label="Search users to add"
                placeholder="Search users to add…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <div className="mt-2 space-y-1.5">
                {nonMembers.map((u) => (
                  <div key={u.id} className={row}>
                    <span>
                      {u.name}{" "}
                      <span className="text-small text-on-surface-variant">{u.departmentId ? "" : "(unassigned)"}</span>
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="max-md:h-12"
                      onClick={() => assign.mutate({ userId: u.id, departmentId: selected.id })}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
