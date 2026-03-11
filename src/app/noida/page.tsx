"use client";

import { useState, useEffect, useMemo } from "react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { getProperties, getActiveVideoForCity, getHotLocations } from "@/lib/supabase/queries";
import { CityFilters, type SortOption } from "@/components/property/CityFilters";
import { CityVideoHighlight } from "@/components/property/CityVideoHighlight";
import type { Property } from "@/types/property";
import type { CityVideo } from "@/lib/sample-videos";

const defaultHotLocations = [
  { name: "Sector 150", tag: "Premium" },
  { name: "Greater Noida West", tag: "Affordable" },
  { name: "Yamuna Expressway", tag: "Investment" },
  { name: "Pari Chowk", tag: "Commercial" },
];

function budgetFilter(p: Property, budget: string) {
  if (budget === "All") return true;
  if (budget === "Under 30L") return p.price < 3000000;
  if (budget === "30L - 50L") return p.price >= 3000000 && p.price < 5000000;
  if (budget === "50L - 1Cr") return p.price >= 5000000 && p.price < 10000000;
  if (budget === "Above 1Cr") return p.price >= 10000000;
  return true;
}

export default function NoidaPage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [highlightVideo, setHighlightVideo] = useState<CityVideo | null>(null);
  const [hotLocations, setHotLocations] = useState(defaultHotLocations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProperties("noida").catch(() => [] as Property[]),
      getActiveVideoForCity("noida").catch(() => null),
      getHotLocations("noida").catch(() => []),
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
      <div className="mb-8">
        <p className="text-sm text-gold font-medium tracking-wide mb-2">&ldquo;Sapno ka Ghar, Noida mein&rdquo;</p>
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">
          Properties in <span className="text-gold-gradient">Noida &amp; Greater Noida</span>
        </h1>
        <p className="text-sm text-muted max-w-2xl">
          Explore flats, commercial shops, villas, and plots across Noida, Greater Noida West, and Greater Noida.
          Jewar Airport, Aqua Line Metro, and Expressway connectivity driving growth.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-6">
        <span className="text-sm font-medium text-muted">🔥 Hot Locations</span>
        <span className="text-surface-border">|</span>
        {hotLocations.map((area) => (
          <span key={area.name} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-gold/10 text-gold/90">
            {area.name} <span className="text-muted font-normal">· {area.tag}</span>
          </span>
        ))}
      </div>

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

      <div className="mt-12 bg-surface rounded-xl border border-surface-border p-6 sm:p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Can&apos;t find what you&apos;re looking for?</h2>
        <p className="text-sm text-muted mb-4 max-w-md mx-auto">
          Tell us your requirements and we&apos;ll find the perfect property for you. We have access to many unlisted properties.
        </p>
        <a
          href={`https://wa.me/919582806827?text=${encodeURIComponent("Hi Kawal, I'm looking for a property in Noida. Here are my requirements:\n\nType: \nBudget: \nArea preference: \nBHK: ")}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-background rounded-lg font-medium hover:bg-gold-light transition-colors"
        >
          Share Requirements on WhatsApp
        </a>
      </div>
    </div>
  );
}
