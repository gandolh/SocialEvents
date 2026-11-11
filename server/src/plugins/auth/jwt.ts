import jwt from "jsonwebtoken";
import type { UserRole } from "@socialevents/shared";

export interface AuthClaims {
  sub: string;
  role: UserRole;
  name: string;
  email: string;
}

const EXPIRES_IN = "7d";

/** Signs and verifies session tokens with one secret. */
export function createTokens(secret: string) {
  return {
    sign(claims: AuthClaims): string {
      return jwt.sign(claims, secret, {
        expiresIn: EXPIRES_IN,
        algorithm: "HS256",
      });
    },
    verify(token: string): AuthClaims | null {
      try {
        const decoded = jwt.verify(token, secret, {
          algorithms: ["HS256"],
        });
        if (typeof decoded === "string") return null;
        const { sub, role, name, email } = decoded as jwt.JwtPayload & Partial<AuthClaims>;
        if (!sub || !role || !name || !email) return null;
        return { sub, role, name, email };
      } catch {
        return null;
      }
    },
  };
}

export type Tokens = ReturnType<typeof createTokens>;
