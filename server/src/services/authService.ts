import type { RegisterInput, LoginInput, User } from "@socialevents/shared";
import { usersRepo } from "../dal/users.js";
import { hashPassword, verifyPassword } from "../auth/password.js";
import { conflict, unauthorized } from "../http/errors.js";
import { sendMail } from "../integrations/email/index.js";

export async function register(input: RegisterInput): Promise<User> {
  const existing = usersRepo.findByEmailWithHash(input.email);
  if (existing) throw conflict("email already registered");

  const passwordHash = await hashPassword(input.password);
  const user = usersRepo.create({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  void sendMail({
    to: user.email,
    subject: "Welcome to SocialEvents",
    html:
      `<p>Hi ${user.name},</p>` +
      `<p>Your SocialEvents account has been created. You can sign in with ${user.email}.</p>` +
      `<p>See you around,<br/>The SocialEvents team</p>`,
  });

  return user;
}

export async function login(input: LoginInput): Promise<User> {
  const record = usersRepo.findByEmailWithHash(input.email);
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
}
