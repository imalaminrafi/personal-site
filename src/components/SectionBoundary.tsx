import { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

/**
 * Isolates a page section so a failure renders a small inline fallback
 * (with a retry button) instead of crashing the whole page.
 */
export default function SectionBoundary({
  name,
  children,
  fallback,
}: {
  name: string;
  children: ReactNode;
  /** Override the default inline card. Pass `null` to render nothing on error. */
  fallback?: ReactNode | null;
}) {
  return (
    <ErrorBoundary
      name={name}
      fallback={
        fallback === undefined ? (
          <SectionFallback label={name} />
        ) : (
          fallback
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export function SectionFallback({ label }: { label: string }) {
  return (
    <div role="alert" className="py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
          <svg
            className="mx-auto mb-3 h-6 w-6 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            {label} could not be displayed
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            This section hit an error. The rest of the page is still working.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-700"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}
