import type { User, EventDetail, UpdateEventInput, EventQuery, AttendeeStatus } from "@socialevents/shared";
export declare function useMe(): import("@tanstack/react-query").UseQueryResult<NoInfer<{
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    departmentId: string | null;
    jobTitle: string | null;
    createdAt: string;
} | null>, Error>;
export declare function useLogin(): import("@tanstack/react-query").UseMutationResult<{
    user: User;
}, Error, {
    email: string;
    password: string;
}, unknown>;
export declare function useRegister(): import("@tanstack/react-query").UseMutationResult<{
    user: User;
}, Error, {
    name: string;
    email: string;
    password: string;
}, unknown>;
export declare function useLogout(): import("@tanstack/react-query").UseMutationResult<void, Error, void, unknown>;
export declare function useUsers(departmentId?: string): import("@tanstack/react-query").UseQueryResult<NoInfer<{
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    departmentId: string | null;
    jobTitle: string | null;
    createdAt: string;
}[]>, Error>;
export declare function useDepartments(): import("@tanstack/react-query").UseQueryResult<NoInfer<{
    id: string;
    name: string;
    createdAt: string;
}[]>, Error>;
export declare function useCreateDepartment(): import("@tanstack/react-query").UseMutationResult<unknown, Error, string, unknown>;
export declare function useDeleteDepartment(): import("@tanstack/react-query").UseMutationResult<unknown, Error, string, unknown>;
export declare function useAssignDepartment(): import("@tanstack/react-query").UseMutationResult<unknown, Error, {
    userId: string;
    departmentId: string | null;
}, unknown>;
export declare function useUpdateProfile(): import("@tanstack/react-query").UseMutationResult<{
    user: User;
}, Error, {
    name?: string;
    jobTitle?: string | null;
}, unknown>;
export declare function useChangePassword(): import("@tanstack/react-query").UseMutationResult<void, Error, {
    currentPassword: string;
    newPassword: string;
}, unknown>;
export declare function useEvents(q?: EventQuery): import("@tanstack/react-query").UseQueryResult<NoInfer<{
    id: string;
    name: string;
    hostId: string;
    hostName: string;
    startsAt: string;
    category: string;
    description: string;
    location: {
        label: string;
        lat: number | null;
        lng: number | null;
    };
    attendeeCount: number;
    createdAt: string;
}[]>, Error>;
export declare function useEvent(id: string | null): import("@tanstack/react-query").UseQueryResult<NoInfer<{
    id: string;
    name: string;
    hostId: string;
    hostName: string;
    startsAt: string;
    category: string;
    description: string;
    location: {
        label: string;
        lat: number | null;
        lng: number | null;
    };
    attendeeCount: number;
    createdAt: string;
    attendees: {
        userId: string;
        name: string;
        email: string;
        status: "invited" | "accepted" | "declined";
    }[];
    rating: {
        average: number;
        count: number;
    };
}>, Error>;
export declare function useCreateEvent(): import("@tanstack/react-query").UseMutationResult<{
    event: EventDetail;
}, Error, {
    name: string;
    startsAt: string;
    description: string;
    category: string;
    location: {
        label: string;
        lat: number | null;
        lng: number | null;
    };
    attendeeUserIds: string[];
    attendeeDepartmentIds: string[];
}, unknown>;
export declare function useUpdateEvent(): import("@tanstack/react-query").UseMutationResult<{
    event: EventDetail;
}, Error, {
    id: string;
    input: UpdateEventInput;
}, unknown>;
export declare function useDeleteEvent(): import("@tanstack/react-query").UseMutationResult<unknown, Error, string, unknown>;
export declare function useRsvp(): import("@tanstack/react-query").UseMutationResult<unknown, Error, {
    id: string;
    status: AttendeeStatus;
}, unknown>;
export declare function useSetEventRating(): import("@tanstack/react-query").UseMutationResult<{
    aggregate: {
        average: number;
        count: number;
    };
    myRating: number | null;
}, Error, {
    id: string;
    rating: number;
}, unknown>;
export declare function useSetHostRating(): import("@tanstack/react-query").UseMutationResult<{
    aggregate: {
        average: number;
        count: number;
    };
    myRating: number | null;
}, Error, {
    hostId: string;
    rating: number;
}, unknown>;
export declare function useNotifications(): import("@tanstack/react-query").UseQueryResult<NoInfer<{
    id: string;
    userId: string;
    message: string;
    read: boolean;
    createdAt: string;
}[]>, Error>;
export declare function useMarkNotification(): import("@tanstack/react-query").UseMutationResult<unknown, Error, {
    id: string;
    read: boolean;
}, unknown>;
export declare function useDeleteNotification(): import("@tanstack/react-query").UseMutationResult<unknown, Error, string, unknown>;
export declare function useWeather(lat: number | null, lng: number | null): import("@tanstack/react-query").UseQueryResult<NoInfer<{
    description: string;
    icon: string;
    mock: boolean;
}>, Error>;
//# sourceMappingURL=hooks.d.ts.map