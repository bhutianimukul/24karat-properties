"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/Button";
import { getFeaturedProperties } from "@/lib/supabase/queries";
import type { Property } from "@/types/property";
import Link from "next/link";

export function FeaturedProperties() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProperties()
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="h-8 w-48 bg-surface-light rounded mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-72 bg-surface-light rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-xl border border-surface-border h-72 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          <span className="text-gold-gradient">Featured</span> Properties
        </h2>
        <p className="text-sm text-muted max-w-lg mx-auto">
          Hand-picked listings by Kawal — premium properties with the best value and location
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featured.map((property, i) => (
          <PropertyCard key={property.id} property={property} index={i} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 mt-8">
        <Link href="/noida">
          <Button variant="secondary" size="lg">
            Noida Properties
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </Link>
        <Link href="/dholera">
          <Button variant="secondary" size="lg">
            Dholera Properties
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </Link>
      </div>
    </section>
  );
}
