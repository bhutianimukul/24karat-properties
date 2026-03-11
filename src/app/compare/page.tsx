"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAllProperties } from "@/lib/supabase/queries";
import type { Property, AIAnalysis } from "@/types/property";

function formatPrice(price: number) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return `${(price / 1000).toFixed(0)}K`;
}

const typeLabels: Record<string, string> = { flat: "Flat", villa: "Villa", plot: "Plot", shop: "Shop", office: "Office", warehouse: "Warehouse" };

interface AIComparison {
  title: string;
  pros: string[];
  cons: string[];
}

interface AICompareResult {
  comparisons: AIComparison[];
  winner: string;
  winner_reasoning: string;
  tip: string;
}

interface Highlight {
  icon: string;
  text: string;
}

interface HighlightsData {
  highlights: Highlight[];
  tags: string[];
  price_insight: string;
}

interface DeepAnalysisEntry {
  propertyId: string;
  analysis: AIAnalysis | null;
  highlights: HighlightsData | null;
}

type AITab = "comparison" | "deep-analysis";

const highlightIconMap: Record<string, React.ReactNode> = {
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

export default function ComparePropertiesPage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    getAllProperties()
      .then(setAllProperties)
      .catch(() => setAllProperties([]))
      .finally(() => setPropertiesLoading(false));
  }, []);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aiResult, setAiResult] = useState<AICompareResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiTab, setAiTab] = useState<AITab>("comparison");
  const [deepAnalysis, setDeepAnalysis] = useState<DeepAnalysisEntry[]>([]);
  const [deepLoading, setDeepLoading] = useState(false);
  const [deepError, setDeepError] = useState("");

  function addProperty(id: string) {
    if (selectedIds.length >= 3 || selectedIds.includes(id)) return;
    setSelectedIds((prev) => [...prev, id]);
    setSearch("");
    setDropdownOpen(false);
    setAiResult(null);
  }

  function removeProperty(id: string) {
    setSelectedIds((prev) => prev.filter((p) => p !== id));
    setAiResult(null);
    setDeepAnalysis([]);
  }

  const selected = allProperties.filter((p) => selectedIds.includes(p.id));

  const searchResults = allProperties.filter((p) => {
    if (selectedIds.includes(p.id)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.city_id.includes(q);
  });

  async function runAiCompare() {
    setAiLoading(true);
    setAiError("");
    setAiResult(null);
    try {
      const res = await fetch("/api/ai/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties: selected.map((p) => ({
            title: p.title,
            property_type: p.property_type,
            city: p.city?.name || p.city_id,
            area: p.area?.name,
            address: p.address,
            price: p.price,
            area_sqft: p.area_sqft,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            facing: p.facing,
            amenities: p.amenities,
          })),
        }),
      });
      const data = await res.json();
      if (data.error) {
        setAiError(data.error);
      } else {
        setAiResult(data);
      }
    } catch {
      setAiError("AI comparison failed — try again");
    } finally {
      setAiLoading(false);
    }
  }

  async function runDeepAnalysis() {
    setDeepLoading(true);
    setDeepError("");
    setDeepAnalysis([]);

    try {
      // Fetch analysis + highlights for each property in parallel
      const results = await Promise.all(
        selected.map(async (p) => {
          const payload = {
            title: p.title,
            property_type: p.property_type,
            city: p.city?.name || p.city_id,
            area: p.area?.name,
            address: p.address,
            price: p.price,
            area_sqft: p.area_sqft,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            facing: p.facing,
            amenities: p.amenities,
            year_built: p.year_built,
          };

          const [analyzeRes, highlightsRes] = await Promise.allSettled([
            fetch("/api/ai/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }).then((r) => r.json()),
            fetch("/api/ai/highlights", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }).then((r) => r.json()),
          ]);

          return {
            propertyId: p.id,
            analysis:
              analyzeRes.status === "fulfilled" && !analyzeRes.value.error
                ? (analyzeRes.value as AIAnalysis)
                : null,
            highlights:
              highlightsRes.status === "fulfilled" && !highlightsRes.value.error
                ? (highlightsRes.value as HighlightsData)
                : null,
          };
        })
      );

      setDeepAnalysis(results);
      if (results.every((r) => !r.analysis && !r.highlights)) {
        setDeepError("AI analysis failed for all properties — try again");
      }
    } catch {
      setDeepError("AI deep analysis failed — try again");
    } finally {
      setDeepLoading(false);
    }
  }

  const rows: { label: string; getValue: (p: Property) => string; highlight?: boolean }[] = [
    { label: "Price", getValue: (p) => `₹${formatPrice(p.price)}`, highlight: true },
    { label: "Price/sqft", getValue: (p) => p.price_per_sqft ? `₹${p.price_per_sqft.toLocaleString("en-IN")}` : "—" },
    { label: "Area", getValue: (p) => `${p.area_sqft.toLocaleString("en-IN")} sqft` },
    { label: "Type", getValue: (p) => typeLabels[p.property_type] },
    { label: "Bedrooms", getValue: (p) => p.bedrooms?.toString() || "—" },
    { label: "Bathrooms", getValue: (p) => p.bathrooms?.toString() || "—" },
    { label: "Floor", getValue: (p) => p.floor_number != null ? `${p.floor_number}/${p.total_floors}` : "—" },
    { label: "Facing", getValue: (p) => p.facing || "—" },
    { label: "Year Built", getValue: (p) => p.year_built?.toString() || "—" },
    { label: "City", getValue: (p) => p.city?.name || p.city_id },
    { label: "Location", getValue: (p) => p.area?.name || p.address },
    { label: "Amenities", getValue: (p) => p.amenities.length.toString() },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Compare <span className="text-gold-gradient">Properties</span>
        </h1>
        <p className="text-sm text-muted">
          Select up to 3 properties to compare side by side. Make smarter decisions with clear comparisons.
        </p>
      </motion.div>

      {/* Property selector */}
      <Card className="p-4 mb-6">
        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selected.map((p) => (
              <span key={p.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-gold-muted text-gold border border-gold/30">
                {p.title}
                <button onClick={() => removeProperty(p.id)} className="hover:text-gold-light cursor-pointer">&times;</button>
              </span>
            ))}
          </div>
        )}

        {/* Search input */}
        {selectedIds.length < 3 ? (
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setDropdownOpen(true); }}
              onFocus={() => setDropdownOpen(true)}
              placeholder={selectedIds.length === 0 ? "Search and add a property..." : `Add ${3 - selectedIds.length} more to compare...`}
              className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {dropdownOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-surface-border rounded-xl shadow-xl shadow-black/20 max-h-60 overflow-y-auto z-50">
                {searchResults.slice(0, 20).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addProperty(p.id)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-light transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-xs">{p.title}</p>
                      <p className="text-[10px] text-muted truncate">{p.address}</p>
                    </div>
                    <span className="text-xs text-gold shrink-0">&#8377;{formatPrice(p.price)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted">Max 3 properties selected. Remove one to add another.</p>
        )}
      </Card>

      {/* Close dropdown on outside click */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}

      {/* AI Section with Tabs */}
      {selected.length >= 2 && (
        <div className="mb-6">
          <Card className="p-5 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
            {/* Header + Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  {(aiLoading || deepLoading) ? (
                    <svg className="w-5 h-5 text-gold animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gold">AI Insights</h2>
                  <p className="text-[10px] text-muted">Compare, analyze &amp; get location highlights</p>
                </div>
              </div>
              <a
                href={`https://wa.me/919582806827?text=${encodeURIComponent(
                  `Hi Kawal, I'm comparing these properties:\n\n${selected.map((p) => `• ${p.title} — ₹${formatPrice(p.price)}`).join("\n")}\n\nWhich one do you recommend and why?`
                )}`}
                target="_blank" rel="noopener noreferrer"
              >
                <Button variant="secondary" size="sm">Ask Expert</Button>
              </a>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-1 p-1 rounded-lg bg-surface-light border border-surface-border mb-4">
              <button
                onClick={() => setAiTab("comparison")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  aiTab === "comparison"
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Quick Compare
              </button>
              <button
                onClick={() => setAiTab("deep-analysis")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  aiTab === "deep-analysis"
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Deep Analysis
              </button>
            </div>

            {/* ═══ Tab Content with Transitions ═══ */}
            <AnimatePresence mode="wait">
            {aiTab === "comparison" && (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* Generate button */}
                {!aiResult && !aiLoading && (
                  <div className="text-center py-4">
                    <p className="text-xs text-muted mb-3">Get instant pros/cons and a recommendation</p>
                    <Button onClick={runAiCompare} size="sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Run AI Compare
                    </Button>
                  </div>
                )}

                {aiError && (
                  <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger mb-4">
                    {aiError}
                  </div>
                )}

                {aiLoading && (
                  <div className="animate-pulse">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {selected.map((p) => (
                        <div key={p.id} className="rounded-lg bg-surface-light border border-surface-border p-3">
                          <div className="h-4 bg-surface-border/50 rounded w-3/4 mb-3" />
                          <div className="space-y-1.5">
                            <div className="h-3 bg-surface-border/50 rounded w-4/5" />
                            <div className="h-3 bg-surface-border/50 rounded w-3/5" />
                            <div className="h-3 bg-surface-border/50 rounded w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg bg-gold-muted border border-gold/20 p-3 text-center">
                      <div className="h-4 bg-gold/10 rounded w-1/2 mx-auto mb-1" />
                      <div className="h-3 bg-gold/10 rounded w-3/4 mx-auto" />
                    </div>
                    <p className="text-xs text-muted text-center mt-3">AI is comparing your properties...</p>
                  </div>
                )}

                {aiResult && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {aiResult.comparisons.map((comp) => (
                        <div
                          key={comp.title}
                          className={`rounded-lg border p-3 ${
                            comp.title === aiResult.winner
                              ? "bg-gold/5 border-gold/30"
                              : "bg-surface-light border-surface-border"
                          }`}
                        >
                          <p className="text-xs font-medium mb-2 line-clamp-1 flex items-center gap-1.5">
                            {comp.title === aiResult.winner && <span className="text-gold">&#9733;</span>}
                            {comp.title}
                          </p>
                          <div className="space-y-1">
                            {comp.pros.map((pro, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="text-success text-xs mt-0.5 shrink-0">&#10003;</span>
                                <span className="text-xs text-muted">{pro}</span>
                              </div>
                            ))}
                            {comp.cons.map((con, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="text-danger text-xs mt-0.5 shrink-0">&#10007;</span>
                                <span className="text-xs text-muted">{con}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg bg-gold-muted border border-gold/20 p-4 mb-3">
                      <p className="text-[10px] text-gold uppercase tracking-wider font-medium mb-1.5">AI Recommendation</p>
                      <p className="text-sm font-semibold text-gold mb-1">&#9733; {aiResult.winner}</p>
                      <p className="text-xs text-muted">{aiResult.winner_reasoning}</p>
                    </div>

                    <div className="rounded-lg bg-surface-light border border-surface-border p-3 mb-3">
                      <p className="text-xs text-muted">
                        <span className="text-gold font-medium">Pro Tip:</span> {aiResult.tip}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted">AI insights are for reference only</p>
                      <Button onClick={runAiCompare} variant="ghost" size="sm">Re-run</Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* ═══ Tab 2: Deep Analysis ═══ */}
            {aiTab === "deep-analysis" && (
              <motion.div
                key="deep-analysis"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {/* Generate button */}
                {deepAnalysis.length === 0 && !deepLoading && (
                  <div className="text-center py-4">
                    <p className="text-xs text-muted mb-3">Get per-property investment scores, location highlights &amp; price trends</p>
                    <Button onClick={runDeepAnalysis} size="sm">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Run Deep Analysis
                    </Button>
                  </div>
                )}

                {deepError && (
                  <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger mb-4">
                    {deepError}
                    <button onClick={runDeepAnalysis} className="block text-xs mt-1 underline cursor-pointer">Try again</button>
                  </div>
                )}

                {/* Loading */}
                {deepLoading && (
                  <div className="animate-pulse">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {selected.map((p) => (
                        <div key={p.id} className="rounded-lg bg-surface-light border border-surface-border p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-surface-border/50" />
                            <div className="flex-1 space-y-1.5">
                              <div className="h-4 bg-surface-border/50 rounded w-1/3" />
                              <div className="h-3 bg-surface-border/50 rounded w-2/3" />
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            {[1, 2, 3].map(i => <div key={i} className="h-5 bg-surface-border/50 rounded-full w-16" />)}
                          </div>
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-3.5 h-3.5 rounded bg-surface-border/50" />
                              <div className="h-3 bg-surface-border/50 rounded" style={{ width: `${80 - i * 10}%` }} />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted text-center">AI is analyzing each property in detail...</p>
                  </div>
                )}

                {/* Deep Analysis Results */}
                {deepAnalysis.length > 0 && !deepLoading && (
                  <>
                    {/* Investment Score Comparison Row */}
                    {deepAnalysis.some(d => d.analysis) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {selected.map((p) => {
                          const entry = deepAnalysis.find(d => d.propertyId === p.id);
                          const a = entry?.analysis;
                          if (!a) return (
                            <div key={p.id} className="rounded-lg bg-surface-light border border-surface-border p-3 text-center">
                              <p className="text-xs text-muted line-clamp-1 mb-1">{p.title}</p>
                              <p className="text-[10px] text-muted">Analysis unavailable</p>
                            </div>
                          );
                          const scoreColor = a.investment_score >= 8 ? "text-success" : a.investment_score >= 6 ? "text-gold" : "text-danger";
                          const scoreLabel = a.investment_score >= 8 ? "Great" : a.investment_score >= 6 ? "Good" : "Risky";
                          const bestScore = Math.max(...deepAnalysis.filter(d => d.analysis).map(d => d.analysis!.investment_score));
                          const isBest = a.investment_score === bestScore;
                          return (
                            <div key={p.id} className={`rounded-lg border p-4 ${isBest ? "bg-gold/5 border-gold/30" : "bg-surface-light border-surface-border"}`}>
                              <p className="text-xs font-medium mb-3 line-clamp-1 flex items-center gap-1.5">
                                {isBest && <span className="text-gold">&#9733;</span>}
                                {p.title}
                              </p>
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`text-3xl font-bold ${scoreColor}`}>{a.investment_score}</div>
                                <div>
                                  <div className="text-xs text-muted">/10</div>
                                  <div className={`text-[10px] font-medium ${scoreColor}`}>{scoreLabel}</div>
                                </div>
                              </div>
                              <p className="text-xs text-muted">{a.investment_reasoning}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Location Tags */}
                    {deepAnalysis.some(d => d.highlights?.tags?.length) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {selected.map((p) => {
                          const entry = deepAnalysis.find(d => d.propertyId === p.id);
                          const tags = entry?.highlights?.tags;
                          if (!tags?.length) return null;
                          return (
                            <div key={p.id} className="flex flex-wrap gap-1.5">
                              {tags.map((tag) => (
                                <span key={tag} className="px-2.5 py-1 text-[10px] font-medium bg-gold-muted text-gold rounded-full border border-gold/20">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Location Highlights */}
                    {deepAnalysis.some(d => d.highlights?.highlights?.length) && (
                      <div className="mb-4">
                        <p className="text-xs font-medium mb-3 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Nearby &amp; Connectivity
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {selected.map((p) => {
                            const entry = deepAnalysis.find(d => d.propertyId === p.id);
                            const hl = entry?.highlights?.highlights;
                            return (
                              <div key={p.id} className="rounded-lg bg-surface-light border border-surface-border p-3">
                                <p className="text-[10px] font-medium text-gold mb-2 line-clamp-1">{p.title}</p>
                                {hl?.length ? (
                                  <div className="space-y-1.5">
                                    {hl.map((h, i) => (
                                      <div key={i} className="flex items-start gap-2">
                                        <svg className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          {highlightIconMap[h.icon] || highlightIconMap.smart_city}
                                        </svg>
                                        <span className="text-xs text-muted">{h.text}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-[10px] text-muted">No highlights available</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Price Insights */}
                    {deepAnalysis.some(d => d.highlights?.price_insight) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {selected.map((p) => {
                          const entry = deepAnalysis.find(d => d.propertyId === p.id);
                          const insight = entry?.highlights?.price_insight;
                          if (!insight) return null;
                          return (
                            <div key={p.id} className="rounded-lg bg-gold-muted border border-gold/20 p-3">
                              <p className="text-[10px] text-gold font-medium uppercase tracking-wider mb-0.5">Price Trend</p>
                              <p className="text-xs text-muted">{insight}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Area Outlook + Best For */}
                    {deepAnalysis.some(d => d.analysis?.area_outlook) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {selected.map((p) => {
                          const entry = deepAnalysis.find(d => d.propertyId === p.id);
                          const a = entry?.analysis;
                          if (!a) return null;
                          return (
                            <div key={p.id} className="rounded-lg bg-surface-light border border-surface-border p-3 space-y-2">
                              <div>
                                <p className="text-[10px] font-medium text-gold mb-0.5">Area Outlook</p>
                                <p className="text-xs text-muted">{a.area_outlook}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-medium text-gold mb-0.5">Best For</p>
                                <p className="text-xs text-muted">{a.best_for}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted">AI insights are for reference only</p>
                      <Button onClick={runDeepAnalysis} variant="ghost" size="sm">Re-run</Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
            </AnimatePresence>
          </Card>
        </div>
      )}

      {/* Comparison table */}
      {selected.length >= 2 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-light border-b border-surface-border">
                  <th className="px-4 py-3 text-left text-xs text-muted font-medium w-32">Feature</th>
                  {selected.map((p) => (
                    <th key={p.id} className="px-4 py-3 text-left text-xs font-medium min-w-[180px]">
                      <div className="line-clamp-2">{p.title}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-surface-border/50">
                    <td className="px-4 py-2.5 text-muted text-xs">{row.label}</td>
                    {selected.map((p) => {
                      const val = row.getValue(p);
                      const isBest = row.highlight && selected.length > 1 && (
                        row.label === "Price"
                          ? p.price === Math.min(...selected.map((s) => s.price))
                          : false
                      );
                      return (
                        <td key={p.id} className={`px-4 py-2.5 ${isBest ? "text-gold font-medium" : ""}`}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted text-sm">
            {selected.length === 0
              ? "Select at least 2 properties above to start comparing"
              : "Select 1 more property to compare"}
          </p>
        </Card>
      )}
    </div>
  );
}
