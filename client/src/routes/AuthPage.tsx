import { useState } from "react";
import { useLogin, useRegister } from "../api/hooks.js";
import { Input, Button } from "../components/ui/index.js";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const login = useLogin();
  const register = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      if (mode === "login") {
        await login.mutateAsync({ email, password });
      } else {
        await register.mutateAsync({ name, email, password });
      }
      // Router redirects via the authenticated guard once `me` is populated.
    } catch (e2) {
      const status = (e2 as { status?: number }).status;
      setErr(
        mode === "login"
          ? "Invalid email or password."
          : status === 409
            ? "That email is already registered."
            : "Could not create your account.",
      );
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 text-on-surface">
      <main className="w-full max-w-sm overflow-hidden rounded-lg border border-outline bg-surface-bright shadow-dialog">
        <div className="border-b border-outline px-6 py-4 text-center aero-bar">
          <h1 className="font-display text-title font-semibold text-primary">SocialEvents</h1>
          <p className="text-label text-on-surface-variant">Internal Coordination</p>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={(e) => void submit(e)} className="flex flex-col gap-4">
            {mode === "register" && (
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            )}
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {err && (
              <p role="alert" className="text-body font-semibold text-error">
                {err}
              </p>
            )}
            <Button type="submit" className="w-full max-md:h-12" disabled={login.isPending || register.isPending}>
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-body text-on-surface-variant">
            {mode === "login" ? "No account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="min-h-11 cursor-pointer rounded-sm font-semibold text-primary underline outline-none focus-visible:aero-focus"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setErr(null);
              }}
            >
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
