import { RouterProvider } from "@tanstack/react-router";
import { useMe } from "./api/hooks.js";
import { router } from "./router.js";
import { AuthPage } from "./routes/AuthPage.js";
import { Spinner } from "./components/ui/index.js";

export function App() {
  const { data: me, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!me) return <AuthPage />;

  return <RouterProvider router={router} />;
}
