"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { PropertyCard } from "@/components/property/PropertyCard";
import { getProperties, getActiveVideoForCity, getHotLocations } from "@/lib/supabase/queries";
import { CityFilters, type SortOption } from "@/components/property/CityFilters";
import { CityVideoHighlight } from "@/components/property/CityVideoHighlight";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Property } from "@/types/property";
import type { CityVideo } from "@/lib/sample-videos";

const defaultHotLocations = [
  { name: "Near Airport", tag: "High Demand" },
  { name: "TP-40", tag: "Commercial" },
  { name: "TP-41", tag: "Residential" },
  { name: "Expressway Belt", tag: "Investment" },
];

function budgetFilter(p: Property, budget: string) {
  if (budget === "All") return true;
  if (budget === "Under 30L") return p.price < 3000000;
  if (budget === "30L - 50L") return p.price >= 3000000 && p.price < 5000000;
  if (budget === "50L - 1Cr") return p.price >= 5000000 && p.price < 10000000;
  if (budget === "Above 1Cr") return p.price >= 10000000;
  return true;
}

export default function DholeraPage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [highlightVideo, setHighlightVideo] = useState<CityVideo | null>(null);
  const [hotLocations, setHotLocations] = useState(defaultHotLocations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProperties("dholera").catch(() => [] as Property[]),
      getActiveVideoForCity("dholera").catch(() => null),
      getHotLocations("dholera").catch(() => []),
    ]).then(([props, video, locations]) => {
      setAllProperties(props);
      setHighlightVideo(video);
      if (locations.length > 0) setHotLocations(locations);
      setLoading(false);
    });
  }, []);

  const [type, setType] = useState("All");
  const [budget, setBudget] = useState("All");
  const [sort, setSort] = useState<SortOption>("default");
  const [transaction, setTransaction] = useState("All");

  const properties = useMemo(() => {
    let filtered = allProperties.filter((p) => {
      if (type !== "All" && p.property_type !== type.toLowerCase()) return false;
      if (transaction === "Buy" && p.transaction_type !== "sell") return false;
      if (transaction === "Rent" && p.transaction_type !== "rent") return false;
      return budgetFilter(p, budget);
    });
    if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
    else if (sort === "newest") filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return filtered;
  }, [allProperties, type, budget, sort, transaction]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-sm text-gold font-medium tracking-wide mb-2">&ldquo;India ka Pehla Smart City — Dholera&rdquo;</p>
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">
          Properties in <span className="text-gold-gradient">Dholera Smart City</span>
        </h1>
        <p className="text-sm text-muted max-w-2xl">
          India&apos;s first greenfield smart city. International airport, DMIC corridor, and massive
          government investment making Dholera the hottest investment destination in Gujarat.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-gold-muted border border-gold/20 rounded-xl p-4 sm:p-5 mb-6"
      >
        <p className="text-sm text-gold font-medium mb-1">Why Dholera?</p>
        <p className="text-xs text-muted">
          Dholera SIR is a government-backed Special Investment Region spanning 920 sq km — 6x the size of Shanghai.
          With international airport, expressway, metro rail, and solar park under development, early investors are seeing
          15-25% annual appreciation.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex items-center gap-2 flex-wrap mb-6"
      >
        <span className="text-sm font-medium text-muted">🔥 Hot Locations</span>
        <span className="text-surface-border">|</span>
        {hotLocations.map((area, i) => (
          <motion.span
            key={area.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-gold/10 text-gold/90"
          >
            {area.name} <span className="text-muted font-normal">· {area.tag}</span>
          </motion.span>
        ))}
      </motion.div>

      <CityFilters type={type} budget={budget} sort={sort} transaction={transaction} onTypeChange={setType} onBudgetChange={setBudget} onSortChange={setSort} onTransactionChange={setTransaction} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-xl border border-surface-border h-72 animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted">No properties match your filters. Try adjusting them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {properties.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      )}

      {highlightVideo && (
        <div className="mt-10">
          <CityVideoHighlight videoUrl={highlightVideo.video_url} title={highlightVideo.title} description={highlightVideo.description} />
        </div>
      )}

      <ScrollReveal className="mt-12 bg-surface rounded-xl border border-surface-border p-6 sm:p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Interested in Dholera investment?</h2>
        <p className="text-sm text-muted mb-4 max-w-md mx-auto">
          Get expert guidance on plot selection, documentation, and investment strategy for Dholera Smart City.
        </p>
        <a
          href={`https://wa.me/919582806827?text=${encodeURIComponent("Hi Kawal, I'm interested in investing in Dholera Smart City. Can you share available plots and pricing?")}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors"
        >
          Get Dholera Investment Advice
        </a>
      </ScrollReveal>
    </div>
  );
}
