"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { CustomerVouch } from "@/types/property";

const propertyTypeLabels: Record<string, string> = {
  flat: "Flat",
  villa: "Villa",
  plot: "Plot",
  shop: "Shop",
  office: "Office",
  warehouse: "Warehouse",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-gold" : "text-surface-border"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function VouchCard({ vouch }: { vouch: CustomerVouch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 h-full flex flex-col">
        {/* Customer Info */}
        <div className="flex items-start gap-3 mb-4">
          {vouch.customer_image ? (
            <img
              src={vouch.customer_image}
              alt={vouch.customer_name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gold-muted border-2 border-gold/30 flex items-center justify-center">
              <span className="text-sm font-bold text-gold">
                {getInitials(vouch.customer_name)}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{vouch.customer_name}</h3>
            {vouch.customer_location && (
              <p className="text-xs text-muted">{vouch.customer_location}</p>
            )}
            <StarRating rating={vouch.experience_rating} />
          </div>
          {vouch.would_recommend && (
            <Badge variant="success" className="shrink-0">Recommends</Badge>
          )}
        </div>

        {/* Property Details */}
        <div className="bg-surface-light rounded-lg p-3 mb-4 border border-surface-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-foreground">{vouch.property_name}</span>
            <Badge variant="gold">{propertyTypeLabels[vouch.property_type]}</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span>{vouch.property_city}{vouch.property_area ? `, ${vouch.property_area}` : ""}</span>
            <span className="w-1 h-1 rounded-full bg-surface-border" />
            <span>{vouch.transaction_type === "sell" ? "Purchased" : "Rented"} {formatDate(vouch.purchase_date)}</span>
          </div>
        </div>

        {/* Review */}
        <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
          &ldquo;{vouch.review}&rdquo;
        </p>

        {/* Highlights */}
        {vouch.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-surface-border">
            {vouch.highlights.map((h) => (
              <span
                key={h}
                className="px-2 py-0.5 text-xs bg-gold-muted text-gold rounded-full border border-gold/20"
              >
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Video link */}
        {vouch.video_url && (
          <a
            href={vouch.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch video testimonial
          </a>
        )}
      </Card>
    </motion.div>
  );
}
