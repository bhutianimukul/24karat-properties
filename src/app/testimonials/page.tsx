import { Metadata } from "next";
import { VouchList } from "@/components/testimonials/VouchList";
import { createClient } from "@/lib/supabase/server";
import type { CustomerVouch } from "@/types/property";

export const metadata: Metadata = {
  title: "Customer Vouches",
  description: "Hear from our happy customers. Real experiences, real reviews from property buyers and tenants.",
};

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customer_vouches")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const allVouches = (data || []) as CustomerVouch[];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-muted border border-gold/20 mb-6">
          <span className="text-sm text-gold">Real Experiences</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          Customer <span className="text-gold-gradient">Vouches</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto">
          Don&apos;t just take our word for it. Here&apos;s what our customers say about their experience with 24 Karat Properties.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { value: "1000+", label: "Happy Families" },
          { value: "4.8", label: "Average Rating" },
          { value: "98%", label: "Would Recommend" },
          { value: "13+", label: "Years of Trust" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-surface-border p-4 text-center">
            <div className="text-2xl font-bold text-gold">{stat.value}</div>
            <div className="text-xs text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Vouch Cards with Show More */}
      <VouchList vouches={allVouches} />
    </div>
  );
}
