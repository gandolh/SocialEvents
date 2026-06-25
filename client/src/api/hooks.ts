import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  User,
  Department,
  EventSummary,
  EventDetail,
  CreateEventInput,
  UpdateEventInput,
  EventQuery,
  Notification,
  RatingResponse,
  Weather,
  AttendeeStatus,
  RegisterInput,
  LoginInput,
} from "@socialevents/shared";
import { api } from "./client.js";

// --- Auth ---
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const { user } = await api.get<{ user: User }>("/auth/me");
        return user;
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) =>
      api.post<{ user: User }>("/auth/login", input),
    onSuccess: ({ user }) => qc.setQueryData(["me"], user),
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      api.post<{ user: User }>("/auth/register", input),
    onSuccess: ({ user }) => qc.setQueryData(["me"], user),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<void>("/auth/logout"),
    onSuccess: () => {
      qc.setQueryData(["me"], null);
      qc.clear();
    },
  });
}

// --- Users / Departments ---
export function useUsers(departmentId?: string) {
  return useQuery({
    queryKey: ["users", departmentId ?? "all"],
    queryFn: () =>
      api
        .get<{ users: User[] }>(
          "/users" + (departmentId ? `?departmentId=${departmentId}` : ""),
        )
        .then((r) => r.users),
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      api.get<{ departments: Department[] }>("/departments").then((r) => r.departments),
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.post("/departments", { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["departments"] }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/departments/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["departments"] });
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useAssignDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { userId: string; departmentId: string | null }) =>
      api.patch(`/users/${vars.userId}/department`, {
        departmentId: vars.departmentId,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name?: string; jobTitle?: string | null }) =>
      api.patch<{ user: User }>("/users/me", input),
    onSuccess: ({ user }) => qc.setQueryData(["me"], user),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      api.patch<void>("/users/me/password", input),
  });
}

// --- Events ---
function eventQueryString(q: EventQuery): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined && v !== "") params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function useEvents(q: EventQuery = {}) {
  return useQuery({
    queryKey: ["events", q],
    queryFn: () =>
      api
        .get<{ events: EventSummary[] }>("/events" + eventQueryString(q))
        .then((r) => r.events),
  });
}

export function useEvent(id: string | null) {
  return useQuery({
    queryKey: ["event", id],
    enabled: !!id,
    queryFn: () =>
      api.get<{ event: EventDetail }>(`/events/${id}`).then((r) => r.event),
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEventInput) =>
      api.post<{ event: EventDetail }>("/events", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; input: UpdateEventInput }) =>
      api.patch<{ event: EventDetail }>(`/events/${vars.id}`, vars.input),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["event", vars.id] });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/events/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useRsvp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; status: AttendeeStatus }) =>
      api.put(`/events/${vars.id}/rsvp`, { status: vars.status }),
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["event", vars.id] }),
  });
}

// --- Ratings ---
export function useSetEventRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; rating: number }) =>
      api.put<RatingResponse>(`/events/${vars.id}/rating`, {
        rating: vars.rating,
      }),
    onSuccess: (_d, vars) =>
      qc.invalidateQueries({ queryKey: ["event", vars.id] }),
  });
}

export function useSetHostRating() {
  return useMutation({
    mutationFn: (vars: { hostId: string; rating: number }) =>
      api.put<RatingResponse>(`/users/${vars.hostId}/rating`, {
        rating: vars.rating,
      }),
  });
}

// --- Notifications ---
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      api
        .get<{ notifications: Notification[] }>("/notifications")
        .then((r) => r.notifications),
    refetchInterval: 60_000,
  });
}

export function useMarkNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; read: boolean }) =>
      api.patch(`/notifications/${vars.id}`, { read: vars.read }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.del(`/notifications/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// --- Weather ---
export function useWeather(lat: number | null, lng: number | null) {
  return useQuery({
    queryKey: ["weather", lat, lng],
    enabled: lat !== null && lng !== null,
    staleTime: 60 * 60 * 1000,
    queryFn: () => api.get<Weather>(`/weather?lat=${lat}&lng=${lng}`),
  });
}
