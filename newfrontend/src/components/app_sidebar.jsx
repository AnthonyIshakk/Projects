import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  BarChart3,
  Package2,
  ShoppingCart,
  Mail,
  Settings,
  User2,
  LogOut,
} from "lucide-react";

function cx(...cls) {
  return cls.filter(Boolean).join(" ");
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    }
    fetchProfile();
  }, []);

  function handleSignOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const main = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { to: "/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { to: "/cards", label: "Product", icon: <Package2 size={18} /> },
    { to: "/sales", label: "Sales", icon: <ShoppingCart size={18} /> },
    { to: "/email", label: "Email", icon: <Mail size={18} /> },
  ];

  const secondary = [
    { to: "/settings", label: "Setting", icon: <Settings size={18} /> },
    { to: "/user", label: "User", icon: <User2 size={18} /> },
  ];

  const labels = [
    { color: "bg-blue-500", text: "Product Plan" },
    { color: "bg-pink-500", text: "Campaign" },
    { color: "bg-purple-500", text: "Stock Product" },
  ];

  return (
    <aside className="h-full w-64 flex flex-col bg-white border shadow-sm rounded-xl p-4">
      <div className="px-4 py-4 border-b flex items-center gap-2">
        <div className="font-bold text-gray-800">My Store</div>
      </div>

      <div className="px-4 py-4 border-b flex items-center gap-3">
        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {profile?.name || "..."}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {profile?.email || "..."}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {main.map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className={cx(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    active
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 border-t pt-4">
          <ul className="space-y-2">
            {labels.map((label) => (
              <li key={label.text} className="flex items-center gap-2 px-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${label.color}`}
                ></span>
                <span className="text-sm text-gray-700">{label.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t pt-4">
          <ul className="space-y-1">
            {secondary.map((item) => {
              const active = location.pathname.startsWith(item.to);
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={cx(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
