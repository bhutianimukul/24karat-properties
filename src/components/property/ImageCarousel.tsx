"use client";

import { useState, useRef } from "react";
import type { PropertyImage } from "@/types/property";

export function ImageCarousel({ images, aspect = "16/10" }: { images: PropertyImage[]; aspect?: string }) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-[${aspect}] bg-surface-light flex items-center justify-center`}>
        <svg className="w-12 h-12 text-surface-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      </div>
    );
  }

  function scrollTo(index: number) {
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    setCurrent(clamped);
    scrollRef.current?.children[clamped]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  function handleScroll() {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrent(index);
  }

  return (
    <div className="relative group">
      {/* Scrollable images */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        style={{ aspectRatio: aspect }}
      >
        {images.map((img, i) => (
          <div key={img.id} className="w-full shrink-0 snap-start">
            <img
              src={img.url}
              alt={img.alt_text || `Image ${i + 1}`}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Arrows — show on hover (desktop) */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollTo(current - 1); }}
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm border border-surface-border flex items-center justify-center text-foreground opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all active:scale-90 cursor-pointer ${current === 0 ? "hidden" : ""}`}
            aria-label="Previous image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollTo(current + 1); }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm border border-surface-border flex items-center justify-center text-foreground opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all active:scale-90 cursor-pointer ${current === images.length - 1 ? "hidden" : ""}`}
            aria-label="Next image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollTo(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${i === current ? "bg-gold w-3" : "bg-white/50"}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Count badge */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-foreground border border-surface-border">
          {current + 1}/{images.length}
        </div>
      )}
    </div>
  );
}
