export class HttpError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(statusCode: number, errorCode: string, message?: string) {
    super(message ?? errorCode);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.name = "HttpError";
  }
}

export const unauthorized = () => new HttpError(401, "unauthorized");
export const forbidden = () => new HttpError(403, "forbidden");
export const notFound = (msg?: string) => new HttpError(404, "not_found", msg);
export const conflict = (msg?: string) => new HttpError(409, "conflict", msg);
