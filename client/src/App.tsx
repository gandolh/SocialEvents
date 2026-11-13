import { RouterProvider } from "@tanstack/react-router";
import { useMe } from "./api/hooks.js";
import { router } from "./router.js";
import { AuthPage } from "./routes/AuthPage.js";
import { Skeleton } from "./components/ui/index.js";

/** The screen while the session loads: the bar's wordmark over a still island, no spinner. */
function SessionLoading() {
  return (
    <div className="flex min-h-dvh flex-col bg-background" role="status" aria-label="Loading">
      <header className="flex h-14 shrink-0 items-center border-b border-outline px-3 aero-bar md:h-topbar md:px-8">
        <span className="font-display text-title font-semibold text-primary">SocialEvents</span>
      </header>
      <main className="mx-auto w-full max-w-[1280px] flex-1 p-3 md:px-8 md:py-4">
        <div className="rounded-lg border border-outline-variant bg-surface-bright p-5 shadow-panel">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="mt-4 h-48" />
        </div>
      </main>
    </div>
  );
}

export function App() {
  const { data: me, isLoading } = useMe();

  if (isLoading) return <SessionLoading />;

  if (!me) return <AuthPage />;

  return <RouterProvider router={router} />;
}
