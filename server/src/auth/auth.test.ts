import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password.js";
import { signToken, verifyToken } from "./jwt.js";

describe("password hashing", () => {
  it("hashes and verifies", async () => {
    const hash = await hashPassword("hunter2pass");
    expect(hash).not.toBe("hunter2pass");
    expect(await verifyPassword("hunter2pass", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });
});

describe("jwt", () => {
  const claims = {
    sub: "u1",
    role: "admin" as const,
    name: "Ada",
    email: "ada@x.com",
  };

  it("signs and verifies round-trip", () => {
    const token = signToken(claims);
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject(claims);
  });

  it("rejects tampered tokens", () => {
    const token = signToken(claims);
    expect(verifyToken(token + "tamper")).toBeNull();
    expect(verifyToken("not.a.token")).toBeNull();
  });
});
