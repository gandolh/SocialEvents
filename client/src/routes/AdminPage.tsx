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
import { Button, Input, Spinner, EmptyState } from "../components/ui/index.js";
import { cn } from "../lib/utils.js";

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
    return <EmptyState message="Admins only." />;
  }
  if (isLoading) return <Spinner />;

  const selected = departments.find((d) => d.id === selectedId) ?? departments[0];
  const members = allUsers.filter((u) => u.departmentId === selected?.id);
  const nonMembers = allUsers.filter(
    (u) =>
      u.departmentId !== selected?.id &&
      u.name.toLowerCase().includes(userSearch.toLowerCase()),
  );

  return (
    <div className="flex h-full gap-6">
      {/* Departments */}
      <div className="flex w-72 shrink-0 flex-col">
        <h3 className="mb-2 text-xl font-bold">Departments</h3>
        <div className="flex-1 space-y-1 overflow-auto">
          {departments.map((d) => (
            <div
              key={d.id}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2",
                selected?.id === d.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-surface-container",
              )}
            >
              <button className="flex-1 text-left" onClick={() => setSelectedId(d.id)}>
                {d.name}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete department "${d.name}"? Members become unassigned.`)) {
                    deleteDept.mutate(d.id);
                    if (selectedId === d.id) setSelectedId(null);
                  }
                }}
                className="text-on-surface-variant hover:text-error"
                aria-label="Delete department"
              >
                <IoTrashOutline size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            placeholder="New department"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => {
              if (newDept.trim()) {
                createDept.mutate(newDept.trim());
                setNewDept("");
              }
            }}
          >
            <IoAdd />
          </Button>
        </div>
      </div>

      {/* Members */}
      <div className="flex flex-1 flex-col">
        <h3 className="mb-2 text-xl font-bold">
          {selected ? `${selected.name} — Members` : "Members"}
        </h3>
        {!selected ? (
          <EmptyState message="Create or select a department." />
        ) : (
          <div className="grid flex-1 grid-cols-2 gap-6 overflow-hidden">
            <div className="flex flex-col overflow-hidden">
              <p className="mb-2 text-sm font-medium text-on-surface-variant">
                Current members ({members.length})
              </p>
              <div className="flex-1 space-y-1 overflow-auto">
                {members.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-lg border border-outline-variant/60 px-3 py-2 text-sm"
                  >
                    <span>{u.name}</span>
                    <button
                      className="text-xs text-error"
                      onClick={() => assign.mutate({ userId: u.id, departmentId: null })}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {members.length === 0 && (
                  <p className="text-sm text-on-surface-variant">No members yet.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col overflow-hidden">
              <Input
                placeholder="Search users to add…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <div className="mt-2 flex-1 space-y-1 overflow-auto">
                {nonMembers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-lg border border-outline-variant/60 px-3 py-2 text-sm"
                  >
                    <span>
                      {u.name}{" "}
                      <span className="text-xs text-on-surface-variant">
                        {u.departmentId ? "" : "(unassigned)"}
                      </span>
                    </span>
                    <button
                      className="text-xs text-primary"
                      onClick={() =>
                        assign.mutate({ userId: u.id, departmentId: selected.id })
                      }
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
