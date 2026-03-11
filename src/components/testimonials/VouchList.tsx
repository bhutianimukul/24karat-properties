"use client";

import { useState, useMemo } from "react";
import { VouchCard } from "@/components/testimonials/VouchCard";
import { Button } from "@/components/ui/Button";
import type { CustomerVouch } from "@/types/property";

const INITIAL_COUNT = 10;

type SortOption = "featured" | "newest" | "oldest";

export function VouchList({ vouches }: { vouches: CustomerVouch[] }) {
  const [showAll, setShowAll] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");

  const sorted = useMemo(() => {
    const copy = [...vouches];
    switch (sort) {
      case "newest":
        return copy.sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime());
      case "oldest":
        return copy.sort((a, b) => new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime());
      default:
        return copy.sort((a, b) => a.sort_order - b.sort_order);
    }
  }, [vouches, sort]);

  const displayed = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);

  return (
    <>
      {/* Sort controls */}
      <div className="flex items-center justify-end gap-2 mb-6">
        <span className="text-xs text-muted">Sort by:</span>
        {(["featured", "newest", "oldest"] as SortOption[]).map((option) => (
          <button
            key={option}
            onClick={() => setSort(option)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
              sort === option
                ? "bg-gold-muted text-gold border-gold/30"
                : "bg-surface-light text-muted border-surface-border hover:border-gold/20 hover:text-foreground"
            }`}
          >
            {option === "featured" ? "Featured" : option === "newest" ? "Newest First" : "Oldest First"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.map((vouch) => (
          <VouchCard key={vouch.id} vouch={vouch} />
        ))}
      </div>

      {vouches.length > INITIAL_COUNT && (
        <div className="text-center mt-10">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : `View All ${vouches.length} Vouches`}
          </Button>
        </div>
      )}
    </>
  );
}
