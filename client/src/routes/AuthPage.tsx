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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="aero-glass-strong w-full max-w-sm rounded-2xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">SocialEvents</h1>
          <p className="text-sm text-on-surface-variant">Internal Coordination</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {err && <p className="text-sm text-error">{err}</p>}
          <Button
            type="submit"
            className="w-full"
            disabled={login.isPending || register.isPending}
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-on-surface-variant">
          {mode === "login" ? "No account?" : "Already have an account?"}{" "}
          <button
            className="font-medium text-primary"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setErr(null);
            }}
          >
            {mode === "login" ? "Register" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
