import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
      <p className="text-lg text-muted mb-6">Page not found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
