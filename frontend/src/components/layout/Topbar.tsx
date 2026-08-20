import { useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, LogOut, User as UserIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initial =
    (user?.user_metadata?.name as string | undefined)?.[0] ??
    user?.email?.[0] ??
    "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur-md dark:bg-gray-950/80 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="flex items-center gap-2.5 border-l pl-3 dark:border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-medium text-white">
            {initial.toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              <h3>{user?.name || "User"}</h3>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export { UserIcon };
