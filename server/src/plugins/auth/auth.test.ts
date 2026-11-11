import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./password.js";
import { createTokens } from "./jwt.js";

describe("password hashing", () => {
  it("hashes and verifies", async () => {
    const hash = await hashPassword("hunter2pass");
    expect(hash).not.toBe("hunter2pass");
    expect(await verifyPassword("hunter2pass", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });
});

describe("jwt", () => {
  const tokens = createTokens("test-secret-test-secret-0123456789");
  const claims = {
    sub: "u1",
    role: "admin" as const,
    name: "Ada",
    email: "ada@x.com",
  };

  it("signs and verifies round-trip", () => {
    const token = tokens.sign(claims);
    const decoded = tokens.verify(token);
    expect(decoded).toMatchObject(claims);
  });

  it("rejects tampered tokens", () => {
    const token = tokens.sign(claims);
    expect(tokens.verify(token + "tamper")).toBeNull();
    expect(tokens.verify("not.a.token")).toBeNull();
  });
});
