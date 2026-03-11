"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import type { AIAnalysis } from "@/types/property";

interface AIAnalysisTabProps {
  analysis: AIAnalysis | null;
  propertyTitle: string;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 8 ? "text-success" : score >= 6 ? "text-gold" : "text-danger";
  return (
    <div className="flex flex-col items-center">
      <div className={`text-4xl font-bold ${color}`}>{score}</div>
      <div className="text-xs text-muted">/10</div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-4 p-4 rounded-lg bg-gold-muted border border-gold/20">
        <div className="w-14 h-14 rounded-full bg-gold/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gold/10 rounded w-1/3" />
          <div className="h-3 bg-gold/10 rounded w-2/3" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-surface-light border border-surface-border space-y-2">
          <div className="h-4 bg-surface-border/50 rounded w-1/4" />
          <div className="h-3 bg-surface-border/50 rounded w-4/5" />
          <div className="h-3 bg-surface-border/50 rounded w-3/5" />
          <div className="h-3 bg-surface-border/50 rounded w-2/3" />
        </div>
        <div className="p-4 rounded-lg bg-surface-light border border-surface-border space-y-2">
          <div className="h-4 bg-surface-border/50 rounded w-1/4" />
          <div className="h-3 bg-surface-border/50 rounded w-3/4" />
          <div className="h-3 bg-surface-border/50 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function AIAnalysisTab({ analysis, propertyTitle }: AIAnalysisTabProps) {
  const [expanded, setExpanded] = useState(false);

  if (!analysis) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Investment Score */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-gold-muted border border-gold/20">
        <ScoreBadge score={analysis.investment_score} />
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">Investment Score</p>
          <p className="text-xs text-muted">{analysis.investment_reasoning}</p>
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-surface-light border border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-success text-lg">+</span>
            <span className="font-medium text-sm">Pros</span>
          </div>
          <ul className="space-y-1.5">
            {analysis.pros.map((pro, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-1.5">
                <span className="text-success mt-0.5 shrink-0">&#10003;</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-surface-light border border-surface-border">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-danger text-lg">&minus;</span>
            <span className="font-medium text-sm">Cons</span>
          </div>
          <ul className="space-y-1.5">
            {analysis.cons.map((con, i) => (
              <li key={i} className="text-xs text-muted flex items-start gap-1.5">
                <span className="text-danger mt-0.5 shrink-0">&#10007;</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Area Outlook & Best For */}
      {expanded && (
        <>
          <Card className="p-4">
            <h4 className="font-medium text-sm mb-1.5">Area Outlook</h4>
            <p className="text-xs text-muted">{analysis.area_outlook}</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-medium text-sm mb-1.5">Best For</h4>
            <p className="text-xs text-muted">{analysis.best_for}</p>
          </Card>
          <p className="text-[10px] text-muted text-center">
            Analysis generated on {new Date(analysis.analyzed_at).toLocaleDateString("en-IN")} &mdash; AI insights are for reference only
          </p>
        </>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-gold hover:text-gold-light w-full text-center cursor-pointer"
      >
        {expanded ? "Show less" : "Show area outlook & more"}
      </button>
    </div>
  );
}
