export declare class ApiError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string, message?: string);
}
export declare const api: {
    get: <T>(path: string) => Promise<T>;
    post: <T>(path: string, body?: unknown) => Promise<T>;
    put: <T>(path: string, body?: unknown) => Promise<T>;
    patch: <T>(path: string, body?: unknown) => Promise<T>;
    del: <T>(path: string) => Promise<T>;
};
//# sourceMappingURL=client.d.ts.map