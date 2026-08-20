import { CheckCircle2, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <button
        onClick={toggleTheme}
        className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">TaskFlow</h1>
        </div>

        <div className="card animate-fade-in p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">{footer}</p>
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  autoComplete?: string;
  placeholder?: string;
}

export function PasswordField({
  value,
  onChange,
  error,
  id = 'password',
  autoComplete = 'current-password',
  placeholder = 'Enter your password',
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Password
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`input pr-10 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
