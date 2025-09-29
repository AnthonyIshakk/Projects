import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
