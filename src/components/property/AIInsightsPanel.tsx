"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { AIAnalysis } from "@/types/property";

interface Highlight {
  icon: string;
  text: string;
}

interface HighlightsData {
  highlights: Highlight[];
  tags: string[];
  price_insight: string;
}

interface PropertyData {
  title: string;
  property_type: string;
  city_id: string;
  city_name: string;
  area_name?: string;
  address: string;
  price: number;
  area_sqft: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  facing?: string | null;
  amenities: string[];
  year_built?: number | null;
  ai_analysis: AIAnalysis | null;
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

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 8 ? "text-success" : score >= 6 ? "text-gold" : "text-danger";
  const label = score >= 8 ? "Great" : score >= 6 ? "Good" : "Risky";
  return (
    <div className="flex items-center gap-2">
      <div className={`text-3xl font-bold ${color}`}>{score}</div>
      <div>
        <div className="text-xs text-muted">/10</div>
        <div className={`text-[10px] font-medium ${color}`}>{label}</div>
      </div>
    </div>
  );
}

export function AIInsightsPanel({ property }: { property: PropertyData }) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(property.ai_analysis);
  const [highlights, setHighlights] = useState<HighlightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  async function fetchAllInsights() {
    setLoading(true);
    setError("");

    const payload = {
      title: property.title,
      property_type: property.property_type,
      city: property.city_name,
      area: property.area_name,
      address: property.address,
      price: property.price,
      area_sqft: property.area_sqft,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      facing: property.facing,
      amenities: property.amenities,
      year_built: property.year_built,
    };

    try {
      // Fetch both in parallel
      const [analyzeRes, highlightsRes] = await Promise.allSettled([
        !analysis ? fetch("/api/ai/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then(r => r.json()) : Promise.resolve(null),
        fetch("/api/ai/highlights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then(r => r.json()),
      ]);

      if (analyzeRes.status === "fulfilled" && analyzeRes.value && !analyzeRes.value.error) {
        setAnalysis(analyzeRes.value);
      }
      if (highlightsRes.status === "fulfilled" && !highlightsRes.value.error) {
        setHighlights(highlightsRes.value);
      }

      // Check if both failed
      const analyzeFailed = analyzeRes.status === "rejected" || analyzeRes.value?.error;
      const highlightsFailed = highlightsRes.status === "rejected" || highlightsRes.value?.error;
      if (analyzeFailed && highlightsFailed && !analysis) {
        setError(analyzeRes.status === "fulfilled" ? analyzeRes.value.error : "AI failed — try again");
      }
    } catch {
      setError("AI insights failed — try again");
    } finally {
      setLoading(false);
    }
  }

  const hasData = analysis || highlights;

  return (
    <Card className="p-5 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-gold">AI Insights</h2>
          <p className="text-xs text-muted">Investment analysis, location highlights &amp; price trends</p>
        </div>
        {!hasData && !loading && (
          <Button onClick={fetchAllInsights} size="sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate
          </Button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-light">
            <div className="w-12 h-12 rounded-full bg-surface-border/50" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-border/50 rounded w-1/3" />
              <div className="h-3 bg-surface-border/50 rounded w-2/3" />
            </div>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => <div key={i} className="h-6 bg-surface-border/50 rounded-full w-20" />)}
          </div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-surface-border/50" />
              <div className="h-3 bg-surface-border/50 rounded" style={{ width: `${75 - i * 10}%` }} />
            </div>
          ))}
          <p className="text-xs text-muted text-center">AI is analyzing this property...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger">
          {error}
          <button onClick={fetchAllInsights} className="block text-xs mt-1 underline cursor-pointer">Try again</button>
        </div>
      )}

      {/* Results */}
      {hasData && !loading && (
        <div className="space-y-4">
          {/* Tags */}
          {highlights?.tags && highlights.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {highlights.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-[10px] font-medium bg-gold-muted text-gold rounded-full border border-gold/20">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Investment Score */}
          {analysis && (
            <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-light border border-surface-border">
              <ScoreBadge score={analysis.investment_score} />
              <div className="flex-1">
                <p className="text-sm font-medium mb-0.5">Investment Score</p>
                <p className="text-xs text-muted">{analysis.investment_reasoning}</p>
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          {analysis && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface-light border border-surface-border">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-success text-sm font-bold">+</span>
                  <span className="font-medium text-xs">Pros</span>
                </div>
                <ul className="space-y-1">
                  {analysis.pros.map((pro, i) => (
                    <li key={i} className="text-xs text-muted flex items-start gap-1.5">
                      <span className="text-success mt-0.5 shrink-0">&#10003;</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-surface-light border border-surface-border">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-danger text-sm font-bold">&minus;</span>
                  <span className="font-medium text-xs">Cons</span>
                </div>
                <ul className="space-y-1">
                  {analysis.cons.map((con, i) => (
                    <li key={i} className="text-xs text-muted flex items-start gap-1.5">
                      <span className="text-danger mt-0.5 shrink-0">&#10007;</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Location Highlights */}
          {highlights?.highlights && highlights.highlights.length > 0 && (
            <div className="p-3 rounded-lg bg-surface-light border border-surface-border">
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Nearby &amp; Connectivity
              </p>
              <div className="space-y-1.5">
                {highlights.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {iconMap[h.icon] || iconMap.smart_city}
                    </svg>
                    <span className="text-xs text-muted">{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Insight */}
          {highlights?.price_insight && (
            <div className="p-3 rounded-lg bg-gold-muted border border-gold/20">
              <p className="text-[10px] text-gold font-medium uppercase tracking-wider mb-0.5">Price Trend</p>
              <p className="text-xs text-muted">{highlights.price_insight}</p>
            </div>
          )}

          {/* Expanded: Area Outlook + Best For */}
          {analysis && expanded && (
            <>
              <div className="p-3 rounded-lg bg-surface-light border border-surface-border">
                <p className="text-xs font-medium mb-1">Area Outlook</p>
                <p className="text-xs text-muted">{analysis.area_outlook}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-light border border-surface-border">
                <p className="text-xs font-medium mb-1">Best For</p>
                <p className="text-xs text-muted">{analysis.best_for}</p>
              </div>
            </>
          )}

          {analysis && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-gold hover:text-gold-light w-full text-center cursor-pointer"
            >
              {expanded ? "Show less" : "Show area outlook & more"}
            </button>
          )}

          <p className="text-[10px] text-muted text-center mt-2">
            AI insights are for reference only — consult Kawal for expert advice
          </p>
        </div>
      )}

      {/* Initial state — no data, not loading */}
      {!hasData && !loading && !error && (
        <p className="text-xs text-muted text-center py-2">
          Click &quot;Generate&quot; to get AI-powered investment analysis, location highlights, and price trends
        </p>
      )}
    </Card>
  );
}
