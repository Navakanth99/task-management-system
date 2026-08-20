import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, User } from "lucide-react";
import { AuthShell, PasswordField } from "@/components/auth/AuthShell";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Full name is required";
    else if (name.trim().length < 2)
      next.name = "Name must be at least 2 characters";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    else if (password.length < 6)
      next.password = "Password must be at least 6 characters";
    if (!confirm) next.confirm = "Please confirm your password";
    else if (confirm !== password) next.confirm = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email, password);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Unable to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start organizing your work and stay on top of your tasks."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Sign in
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
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Jane Doe"
              className={`input pl-9 ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            className={`input ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
          />
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
          id="register-password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />

        <PasswordField
          value={confirm}
          onChange={setConfirm}
          error={errors.confirm}
          id="confirm-password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Spinner />}
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}
