import type { RegisterInput, LoginInput, User } from "@socialevents/shared";
import { hashPassword, verifyPassword } from "../../plugins/auth/index.js";
import { conflict, unauthorized } from "../../lib/http-error.js";
import type { Mailer } from "../notifications/index.js";
import type { UsersStore } from "../users/index.js";

/** Registering and signing in. Neither knows about HTTP: the routes start the session. */
export function createAuthService({ users, mailer }: { users: UsersStore; mailer: Mailer }) {
  return {
    async register(input: RegisterInput): Promise<User> {
      const existing = users.findByEmailWithHash(input.email);
      if (existing) throw conflict("email already registered");

      const passwordHash = await hashPassword(input.password);
      const user = users.create({
        name: input.name,
        email: input.email,
        passwordHash,
      });

      void mailer.send({
        to: user.email,
        subject: "Welcome to SocialEvents",
        html:
          `<p>Hi ${user.name},</p>` +
          `<p>Your SocialEvents account has been created. You can sign in with ${user.email}.</p>` +
          `<p>See you around,<br/>The SocialEvents team</p>`,
      });

      return user;
    },

    async login(input: LoginInput): Promise<User> {
      const record = users.findByEmailWithHash(input.email);
      // Generic error on both branches — don't reveal whether the email exists.
      if (!record) {
        // Run a hash comparison anyway to limit timing differences.
        await verifyPassword(input.password, "$2b$12$" + "x".repeat(53));
        throw unauthorized();
      }
      const ok = await verifyPassword(input.password, record.passwordHash);
      if (!ok) throw unauthorized();
      const { passwordHash: _ignored, ...user } = record;
      void _ignored;
      return user;
    },
  };
}
