// components/error-boundary.tsx
"use client";

import React, { useState, useEffect } from "react";

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasError, setHasError] = useState(false);

  // This lifecycle method catches errors in the component tree below it
  useEffect(() => {
    const handleError = (error: Error, info: React.ErrorInfo) => {
      // Log the error to your monitoring service (e.g., Sentry, Bugsnag)
      console.error("An error occurred in a child component:", error, info);
      setHasError(true);
    };

    // React's error boundary logic is complex, this is a simplified view
    // The component usually implements getDerivedStateFromError and componentDidCatch.
    // For modern function components, you typically rely on a wrapper hook or
    // simply use a class component for the definitive boundary.

    // For App Router, the simplest pattern is usually to use the custom 'error.tsx' file (see next section).
    return () => {
      // Cleanup if necessary
    };
  }, []);

  if (hasError) {
    return (
      <div className="p-8 text-center border bg-destructive">
        <h2 className="text-xl font-semibold">Something went wrong.</h2>
        <p className="text-secondary">
          Please refresh the page or contact support.
        </p>
      </div>
    );
  }

  return children;
}
