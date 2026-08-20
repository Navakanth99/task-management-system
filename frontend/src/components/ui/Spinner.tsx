import { Loader2 } from 'lucide-react';

export function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function FullPageSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-950">
      <Spinner className="h-8 w-8 text-brand-600" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
