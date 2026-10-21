import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { FC } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Helper component that throws an error on demand
const ProblemChild: FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Explosive test failure');
  }
  return <div>Smooth sailing</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    // Suppress console.error in test output for intentional errors
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('catches uncaught exceptions and displays accessible fallback UI', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(screen.getByText('Something went wrong in this section')).toBeInTheDocument();
    expect(screen.getByText(/Explosive test failure/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });

  it('triggers onReset callback when user clicks Try Again', () => {
    const handleReset = vi.fn();

    render(
      <ErrorBoundary onReset={handleReset}>
        <ProblemChild />
      </ErrorBoundary>
    );

    const tryAgainBtn = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(tryAgainBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('supports custom fallback node or render function', () => {
    render(
      <ErrorBoundary fallback={<div>Custom backup view</div>}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom backup view')).toBeInTheDocument();
  });

  it('invokes onError prop when error is captured', () => {
    const handleError = vi.fn();

    render(
      <ErrorBoundary onError={handleError}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(handleError.mock.calls[0][0].message).toBe('Explosive test failure');
  });
});
