import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, AlertCircle } from "lucide-react";
import { AuthShell, PasswordField } from "@/components/auth/AuthShell";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";

interface LocationState {
  from?: { pathname: string };
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from =
    (location.state as LocationState | null)?.from?.pathname ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);

      navigate(from, { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue managing your tasks."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {serverError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className={`input pl-9 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <PasswordField
          value={password}
          onChange={setPassword}
          error={errors.password}
          id="login-password"
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Spinner />}
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthShell>
  );
}
