export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    message?: string,
  ) {
    super(message ?? errorCode);
    this.name = "HttpError";
  }
}

export const badRequest = (msg?: string) => new HttpError(400, "bad_request", msg);
export const unauthorized = () => new HttpError(401, "unauthorized");
export const forbidden = () => new HttpError(403, "forbidden");
export const notFound = (msg?: string) => new HttpError(404, "not_found", msg);
export const conflict = (msg?: string) => new HttpError(409, "conflict", msg);
