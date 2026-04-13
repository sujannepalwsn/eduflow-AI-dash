import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends (React.Component as any) {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <div className="rounded-full bg-red-100 p-4 text-red-600">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mt-2 text-gray-600 max-w-md">
            The application encountered an unexpected error. This might be due to a connection issue or a temporary glitch.
          </p>
          <div className="mt-8 flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <RefreshCcw className="mr-2 h-5 w-5" />
              Reload Page
            </button>
          </div>
          {this.state.error && (
            <div className="mt-8 w-full max-w-2xl overflow-auto rounded-lg bg-gray-100 p-4 text-left text-xs font-mono text-gray-700">
              <p className="font-bold mb-2">Error Details:</p>
              {this.state.error.message}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
