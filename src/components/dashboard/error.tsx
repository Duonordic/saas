// app/dashboard/error.tsx
"use client"; // This is required for error boundaries

import { useEffect } from "react";

// The error.tsx component receives the error object and a reset function
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void; // Function to attempt re-rendering the segment
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h2 className="text-3xl font-bold text-red-600 mb-4">Dashboard Error</h2>
      <p className="text-lg text-muted-foreground mb-6">
        Failed to load this section due to an unexpected issue.
      </p>
      <button
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
      <p className="mt-4 text-sm text-gray-500">
        Error Details: {error.message}
      </p>
    </div>
  );
}
