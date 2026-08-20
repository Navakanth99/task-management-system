import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Unable to load your data.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-white px-6 py-16 text-center dark:bg-gray-900">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Try Again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}

export function EmptyState({ title, message, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-white px-6 py-16 text-center dark:bg-gray-900">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {message && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>}
      </div>
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </div>
  );
}
