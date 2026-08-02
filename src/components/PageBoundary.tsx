import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";

/**
 * Isolates a route so a crashing page shows a friendly fallback (with retry
 * and a link home) instead of blanking the entire application.
 */
export default function PageBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      name="page"
      fallback={(reset) => (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-zinc-950">
          <div className="mx-auto w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
              <svg
                className="h-8 w-8 text-amber-500"
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
            </div>
            <h1 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">
              This page hit an error
            </h1>
            <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
              Something went wrong while rendering this page. The rest of the site is
              unaffected — you can retry or head back to the homepage.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={reset}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                Retry
              </button>
              <Link
                to="/"
                className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
