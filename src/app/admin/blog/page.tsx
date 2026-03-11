"use client";

import { Card } from "@/components/ui/Card";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Blog Posts</h1>
        <p className="text-sm text-muted">Manage blog articles and market insights</p>
      </div>

      <Card className="p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gold-muted flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="font-semibold mb-1">Coming Soon</h3>
        <p className="text-sm text-muted max-w-sm mx-auto">
          Blog management with rich text editor, SEO optimization, and city-wise categorization will be available in Phase 3.
        </p>
      </Card>
    </div>
  );
}
