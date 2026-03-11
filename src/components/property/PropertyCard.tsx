"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ImageCarousel } from "@/components/property/ImageCarousel";
import type { Property } from "@/types/property";

const typeLabels: Record<string, string> = {
  flat: "Flat",
  villa: "Villa",
  plot: "Plot",
  shop: "Shop",
  office: "Office",
  warehouse: "Warehouse",
};

function formatPrice(price: number) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return `${(price / 1000).toFixed(0)}K`;
}

export function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  const isRent = property.transaction_type === "rent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Link href={`/property/${property.slug}`}>
        <div className="group bg-surface rounded-xl border border-surface-border overflow-hidden transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1 active:scale-[0.98] active:shadow-none">
          {/* Image Carousel */}
          <div className="relative">
            <ImageCarousel images={property.images || []} aspect="16/10" />

            {/* Badges overlay */}
            <div className="absolute top-3 left-3 flex gap-1.5 z-10 pointer-events-none">
              <Badge variant="gold">{typeLabels[property.property_type]}</Badge>
              {property.is_featured && (
                <Badge variant="success">Featured</Badge>
              )}
            </div>

            {/* Rent/Sell badge top-right */}
            <div className="absolute top-3 right-3 z-10 pointer-events-none">
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                isRent
                  ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                  : "bg-success/20 text-success border border-success/30"
              }`}>
                {isRent ? "For Rent" : "For Sale"}
              </span>
            </div>

            {/* Price overlay */}
            <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-surface-border">
                <span className="text-lg font-bold text-gold">&#8377;{formatPrice(property.price)}</span>
                {isRent && <span className="text-xs text-muted">/mo</span>}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-sm sm:text-base group-hover:text-gold transition-colors line-clamp-1 mb-1">
              {property.title}
            </h3>
            <p className="text-xs text-muted mb-3 flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{property.area?.name || property.address}{property.city ? `, ${property.city.name}` : ""}</span>
            </p>

            {/* Details */}
            <div className="flex items-center gap-3 text-xs text-muted">
              {property.bedrooms != null && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {property.bedrooms} BHK
                </span>
              )}
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {property.area_sqft.toLocaleString("en-IN")} sqft
              </span>
              {property.price_per_sqft && (
                <span className="text-gold/70 ml-auto">
                  &#8377;{property.price_per_sqft.toLocaleString("en-IN")}/sqft
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
