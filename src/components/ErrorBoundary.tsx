/**
 * Production-ready, accessible Error Boundary component.
 * Catches uncaught runtime JavaScript errors anywhere in its child component tree,
 * logs error details for debugging, and renders a fallback UI instead of crashing the whole app.
 * Fully compliant with WCAG 2.1 AA with role="alert" and aria-live="assertive".
 *
 * @module ErrorBoundary
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Props for ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  /**
   * Sub-tree wrapped by the error boundary.
   */
  children: ReactNode;
  /**
   * Optional custom fallback renderer function or ReactNode.
   */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /**
   * Optional callback triggered when an error is caught.
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Optional reset callback invoked when user clicks try again.
   */
  onReset?: () => void;
}

/**
 * Internal state for ErrorBoundary.
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Class-based Error Boundary adhering to React specifications.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public static displayName = 'ErrorBoundary';

  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  /**
   * Update state so the next render will show the fallback UI.
   *
   * @param error - The caught error
   * @returns Updated state with error details
   */
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  /**
   * Catch errors and dispatch notifications or logging.
   *
   * @param error - The uncaught error
   * @param errorInfo - React component stack trace
   */
  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // Safe console logging for diagnostic audits
    console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset the boundary state to allow user to retry rendering children.
   */
  public handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public override render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (typeof fallback === 'function') {
        return fallback(error, this.handleReset);
      }
      if (fallback) {
        return fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[360px] flex items-center justify-center p-6"
        >
          <div className="w-full max-w-lg bg-white border border-danger-200 rounded-2xl shadow-xl p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-danger-50 text-danger-600 border border-danger-200 flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-8 h-8" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-surface-900 tracking-tight">
                Something went wrong in this section
              </h2>
              <p className="text-sm text-surface-600">
                An unexpected interface error occurred. Your saved plans in localStorage remain safe.
              </p>
            </div>

            {error.message && (
              <div className="text-left bg-surface-50 border border-surface-200 rounded-xl p-3.5 text-xs font-mono text-danger-700 overflow-x-auto max-h-32">
                <span className="font-bold text-surface-700">Error: </span>
                {error.message}
              </div>
            )}

            {process.env.NODE_ENV !== 'production' && errorInfo?.componentStack && (
              <details className="text-left text-xs text-surface-500 bg-surface-100 rounded-lg p-3">
                <summary className="cursor-pointer font-semibold text-surface-700">
                  Component Stack Trace
                </summary>
                <pre className="mt-2 text-[11px] font-mono whitespace-pre-wrap overflow-x-auto">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-aura-600 hover:bg-aura-700 text-white font-semibold text-sm shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-aura-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-200 text-surface-800 font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-surface-400"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
