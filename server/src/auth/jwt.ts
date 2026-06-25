import jwt from "jsonwebtoken";
import type { UserRole } from "@socialevents/shared";
import { config } from "../config/env.js";

export interface AuthClaims {
  sub: string;
  role: UserRole;
  name: string;
  email: string;
}

const EXPIRES_IN = "7d";

export function signToken(claims: AuthClaims): string {
  return jwt.sign(claims, config.jwtSecret, {
    expiresIn: EXPIRES_IN,
    algorithm: "HS256",
  });
}

export function verifyToken(token: string): AuthClaims | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ["HS256"],
    });
    if (typeof decoded === "string") return null;
    const { sub, role, name, email } = decoded as jwt.JwtPayload &
      Partial<AuthClaims>;
    if (!sub || !role || !name || !email) return null;
    return { sub, role, name, email };
  } catch {
    return null;
  }
}
