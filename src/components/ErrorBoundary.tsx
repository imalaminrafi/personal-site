import { Component, ErrorInfo, ReactNode } from "react";

export type ErrorFallback =
  | ReactNode
  | ((reset: () => void, error: Error | null) => ReactNode);

interface Props {
  children: ReactNode;
  fallback?: ErrorFallback;
  /** Human-readable label used in logs (e.g. "Hero", "Portfolio Page"). */
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const name = this.props.name ? ` [${this.props.name}]` : "";
    console.error(`[ErrorBoundary${name}] Uncaught error:`, error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (typeof fallback === "function") {
        return fallback(this.handleReset, this.state.error);
      }
      if (fallback) return fallback;
      return <DefaultFallback onRetry={this.handleReset} error={this.state.error} />;
    }

    return this.props.children;
  }
}

function DefaultFallback({ onRetry, error }: { onRetry: () => void; error: Error | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 dark:bg-[#0F172A]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8">
          An unexpected error occurred. Please try refreshing the page.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-colors text-sm"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors text-sm"
          >
            Reload Page
          </button>
        </div>
        {error && (
          <details className="mt-8 text-left">
            <summary className="text-xs text-zinc-500 dark:text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors">
              View error details
            </summary>
            <pre className="mt-3 p-4 bg-zinc-100 dark:bg-[#162032] rounded-xl text-xs text-red-600 dark:text-red-400 overflow-auto max-h-40 border border-zinc-200 dark:border-[#1E3A5F]">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default ErrorBoundary;
