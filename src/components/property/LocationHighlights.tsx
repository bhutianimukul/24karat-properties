"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface Highlight {
  icon: string;
  text: string;
}

interface HighlightsData {
  highlights: Highlight[];
  tags: string[];
  price_insight: string;
}

const iconMap: Record<string, React.ReactNode> = {
  metro: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l-2 4m10-4l2 4M12 3v2m0 0a4 4 0 014 4v4a4 4 0 01-4 4m0-12a4 4 0 00-4 4v4a4 4 0 004 4m0 0h0" />,
  airport: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l-7-7 3-3 4 4 8-8 3 3-11 11z" />,
  road: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />,
  school: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />,
  hospital: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  shopping: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />,
  park: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  temple: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3L2 12h3v8h14v-8h3L12 3zm0 3.5L7 11v6h10v-6l-5-4.5z" />,
  it_hub: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  smart_city: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
};

interface LocationHighlightsProps {
  city: string;
  area?: string;
  address: string;
  propertyType: string;
}

export function LocationHighlights({ city, area, address, propertyType }: LocationHighlightsProps) {
  const [data, setData] = useState<HighlightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchHighlights() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, area, address, property_type: propertyType }),
      });
      const result = await res.json();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch {
      setError("Failed to load highlights");
    } finally {
      setLoading(false);
    }
  }

  if (!data && !loading && !error) {
    return (
      <button
        onClick={fetchHighlights}
        className="w-full flex items-center gap-3 p-3.5 rounded-lg bg-surface-light border border-surface-border hover:border-gold/30 transition-colors cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
          <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="text-left flex-1">
          <p className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">AI Location Insights</p>
          <p className="text-xs text-muted">Nearby landmarks, connectivity &amp; price trends</p>
        </div>
        <svg className="w-4 h-4 text-muted group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  if (loading) {
    return (
      <div className="p-4 rounded-lg bg-surface-light border border-surface-border animate-pulse space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gold/10" />
          <div className="h-4 bg-surface-border/50 rounded w-1/3" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-surface-border/50" />
            <div className="h-3 bg-surface-border/50 rounded" style={{ width: `${70 - i * 8}%` }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger">
        {error}
        <button onClick={fetchHighlights} className="block text-xs mt-1 underline cursor-pointer">Try again</button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-3">
      {/* Tags */}
      {data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 text-[10px] font-medium bg-gold-muted text-gold rounded-full border border-gold/20">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Highlights */}
      <div className="space-y-2">
        {data.highlights.map((h, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <svg className="w-4 h-4 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {iconMap[h.icon] || iconMap.smart_city}
            </svg>
            <span className="text-xs text-muted">{h.text}</span>
          </div>
        ))}
      </div>

      {/* Price Insight */}
      {data.price_insight && (
        <div className="p-2.5 rounded-lg bg-gold-muted border border-gold/20">
          <p className="text-[10px] text-gold font-medium uppercase tracking-wider mb-0.5">Price Insight</p>
          <p className="text-xs text-muted">{data.price_insight}</p>
        </div>
      )}

      <button onClick={fetchHighlights} className="text-[10px] text-muted hover:text-gold cursor-pointer">
        Regenerate insights
      </button>
    </div>
  );
}
