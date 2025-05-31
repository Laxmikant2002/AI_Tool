import React from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.ErrorContainer} role="alert">
          <h2>Something went wrong</h2>
          <p>We're sorry, but there was an error. Please try refreshing the page.</p>
          {this.state.error && (
            <pre className={styles.ErrorDetails}>
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className={styles.RefreshButton}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 