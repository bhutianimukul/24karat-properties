"use client";

import { Card } from "@/components/ui/Card";

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Inquiries</h1>
        <p className="text-sm text-muted">Track WhatsApp and form inquiries from potential buyers</p>
      </div>

      <Card className="p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gold-muted flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-semibold mb-1">Coming Soon</h3>
        <p className="text-sm text-muted max-w-sm mx-auto">
          Inquiry tracking with WhatsApp integration, lead status management, and follow-up reminders will be available after Supabase database setup.
        </p>
      </Card>
    </div>
  );
}
