"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong</h1>
          <p className="text-sm text-gray-400 mb-6">{error.message || "An unexpected error occurred"}</p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
