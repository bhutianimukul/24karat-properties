"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-danger mb-4">Something went wrong</h1>
      <p className="text-sm text-muted mb-6">{error.message || "An unexpected error occurred"}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
}
