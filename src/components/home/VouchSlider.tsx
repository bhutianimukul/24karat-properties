"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getActiveVouches } from "@/lib/supabase/queries";
import type { CustomerVouch } from "@/types/property";

interface VouchDisplay {
  name: string;
  location: string;
  property: string;
  rating: number;
  quote: string;
}

// Seeded shuffle — changes daily so it feels random but stays consistent within a session
function seededShuffle<T>(arr: T[]): T[] {
  const seed = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    hash = ((hash << 5) - hash + i) | 0;
    const j = Math.abs(hash) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function mapVouch(v: CustomerVouch): VouchDisplay {
  return {
    name: v.customer_name,
    location: v.customer_location || "",
    property: v.property_name,
    rating: v.experience_rating,
    quote: v.review,
  };
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function VouchSlider() {
  const [rawVouches, setRawVouches] = useState<CustomerVouch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveVouches()
      .then(setRawVouches)
      .catch(() => setRawVouches([]))
      .finally(() => setLoading(false));
  }, []);

  const vouches = useMemo(() => {
    const mapped = rawVouches.map(mapVouch);
    return seededShuffle(mapped).slice(0, 3);
  }, [rawVouches]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / vouches.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, vouches.length - 1));
  }, [vouches.length]);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <div className="h-8 w-56 bg-surface-light rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-72 bg-surface-light rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-xl border border-surface-border p-6 h-48 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Customer <span className="text-gold-gradient">Vouches</span>
        </h2>
        <p className="text-muted max-w-xl mx-auto">
          Real experiences from real customers who trusted 24 Karat Properties.
        </p>
      </div>

      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 mb-2 md:mb-8 overflow-x-auto scrollbar-none scroll-snap-x -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible pb-2 md:pb-0">
        {vouches.map((vouch, i) => (
          <motion.div
            key={vouch.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="min-w-[280px] sm:min-w-[320px] md:min-w-0 bg-surface rounded-xl border border-surface-border p-5 sm:p-6 transition-all duration-300 hover:border-gold/20 hover:shadow-md hover:shadow-gold/5"
          >
            <div className="flex gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className={`w-4 h-4 transition-colors ${s <= vouch.rating ? "text-gold" : "text-surface-border"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-muted mb-4 leading-relaxed line-clamp-4">&ldquo;{vouch.quote}&rdquo;</p>
            <div className="flex items-center gap-3 pt-3 border-t border-surface-border">
              <div className="w-9 h-9 rounded-full bg-gold-muted flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-gold">{getInitials(vouch.name)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{vouch.name}</p>
                <p className="text-xs text-muted truncate">{vouch.property} &middot; {vouch.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll hint — mobile only */}
      <div className="flex items-center justify-center gap-1.5 mb-6 md:hidden">
        {vouches.map((_, i) => (
          <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? "bg-gold" : "bg-surface-border"}`} />
        ))}
        <span className="text-[10px] text-muted ml-1.5">swipe</span>
      </div>

      <div className="text-center">
        <Link href="/testimonials">
          <Button variant="secondary">View All Customer Vouches</Button>
        </Link>
      </div>
    </section>
  );
}
