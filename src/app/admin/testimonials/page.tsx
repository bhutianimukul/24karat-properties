"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface VouchItem {
  id: string;
  customer_name: string;
  property_name: string;
  property_city: string;
  review: string;
  experience_rating: number;
  is_active: boolean;
  sort_order: number;
}

const emptyForm = { customer_name: "", customer_location: "", property_name: "", property_city: "", property_type: "flat", transaction_type: "sell", purchase_date: "", review: "", experience_rating: 5, highlights: [] as string[] };

export default function AdminTestimonialsPage() {
  const [vouches, setVouches] = useState<VouchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [highlightInput, setHighlightInput] = useState("");

  useEffect(() => {
    fetchVouches();
  }, []);

  function fetchVouches() {
    setLoading(true);
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((data) => setVouches(Array.isArray(data) ? data : []))
      .catch(() => setVouches([]))
      .finally(() => setLoading(false));
  }

  async function persistVouches(updated: VouchItem[]) {
    setSaving(true);
    try {
      await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          updated.map((v) => ({ id: v.id, is_active: v.is_active, sort_order: v.sort_order }))
        ),
      });
    } catch {
      // silent — state already updated optimistically
    } finally {
      setSaving(false);
    }
  }

  function toggleActive(id: string) {
    setVouches((prev) => {
      const updated = prev.map((v) => (v.id === id ? { ...v, is_active: !v.is_active } : v));
      persistVouches(updated);
      return updated;
    });
  }

  function moveUp(id: string) {
    setVouches((prev) => {
      const idx = prev.findIndex((v) => v.id === id);
      if (idx <= 0) return prev;
      const copy = [...prev];
      [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
      const updated = copy.map((v, i) => ({ ...v, sort_order: i }));
      persistVouches(updated);
      return updated;
    });
  }

  function moveDown(id: string) {
    setVouches((prev) => {
      const idx = prev.findIndex((v) => v.id === id);
      if (idx >= prev.length - 1) return prev;
      const copy = [...prev];
      [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
      const updated = copy.map((v, i) => ({ ...v, sort_order: i }));
      persistVouches(updated);
      return updated;
    });
  }

  const activeCount = vouches.filter((v) => v.is_active).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Testimonials</h1>
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Testimonials</h1>
        <p className="text-sm text-muted">
          {activeCount} of {vouches.length} testimonials visible on website. Toggle visibility and reorder below.
          {saving && <span className="ml-2 text-gold">Saving...</span>}
        </p>
      </div>

      <Button size="sm" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "+ Add Testimonial"}
      </Button>

      {showForm && (
        <Card className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Customer Name *" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
            <input placeholder="Location (e.g. Noida, UP)" value={form.customer_location} onChange={(e) => setForm({ ...form, customer_location: e.target.value })} className="bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
            <input placeholder="Property Name *" value={form.property_name} onChange={(e) => setForm({ ...form, property_name: e.target.value })} className="bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
            <input placeholder="Property City *" value={form.property_city} onChange={(e) => setForm({ ...form, property_city: e.target.value })} className="bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
            <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50">
              <option value="flat">Flat</option><option value="villa">Villa</option><option value="plot">Plot</option><option value="shop">Shop</option><option value="office">Office</option>
            </select>
            <input type="date" placeholder="Purchase Date *" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })} className="bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
          </div>
          <textarea placeholder="Review / Testimonial *" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} rows={3} className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 resize-none" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted">Rating:</label>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setForm({ ...form, experience_rating: n })} className={`w-7 h-7 rounded text-sm cursor-pointer ${form.experience_rating >= n ? "bg-gold text-background" : "bg-surface-light text-muted"}`}>{n}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input placeholder="Add highlight (e.g. Great negotiation)" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && highlightInput.trim()) { setForm({ ...form, highlights: [...form.highlights, highlightInput.trim()] }); setHighlightInput(""); }}} className="flex-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-gold/50" />
            <Button size="sm" variant="secondary" onClick={() => { if (highlightInput.trim()) { setForm({ ...form, highlights: [...form.highlights, highlightInput.trim()] }); setHighlightInput(""); }}}>Add</Button>
          </div>
          {form.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.highlights.map((h, i) => (
                <span key={i} className="px-2 py-0.5 text-xs bg-gold-muted text-gold rounded-full border border-gold/20 flex items-center gap-1">
                  {h} <button onClick={() => setForm({ ...form, highlights: form.highlights.filter((_, j) => j !== i) })} className="hover:text-gold-light cursor-pointer">&times;</button>
                </span>
              ))}
            </div>
          )}
          <Button disabled={submitting || !form.customer_name || !form.property_name || !form.review || !form.purchase_date} onClick={async () => {
            setSubmitting(true);
            try {
              const res = await fetch("/api/admin/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, sort_order: vouches.length, would_recommend: true }),
              });
              if (!res.ok) throw new Error("Failed");
              setForm(emptyForm);
              setShowForm(false);
              fetchVouches();
            } catch { alert("Failed to create testimonial"); }
            finally { setSubmitting(false); }
          }}>{submitting ? "Saving..." : "Save Testimonial"}</Button>
        </Card>
      )}

      <p className="text-xs text-muted bg-surface-light border border-surface-border rounded-lg p-3">
        The homepage vouch slider shows the first 10 active testimonials. The /testimonials page shows all active ones. Drag or use arrows to reorder.
      </p>

      <div className="space-y-2">
        {vouches.map((vouch, i) => (
          <Card
            key={vouch.id}
            className={`p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
              !vouch.is_active ? "opacity-50" : ""
            }`}
          >
            {/* Order controls */}
            <div className="flex sm:flex-col gap-1 shrink-0">
              <button
                onClick={() => moveUp(vouch.id)}
                disabled={i === 0}
                className="p-1 rounded hover:bg-surface-light disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <span className="text-[10px] text-muted text-center w-6">{i + 1}</span>
              <button
                onClick={() => moveDown(vouch.id)}
                disabled={i === vouches.length - 1}
                className="p-1 rounded hover:bg-surface-light disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{vouch.customer_name}</span>
                <span className="text-gold text-xs">{"★".repeat(vouch.experience_rating)}</span>
              </div>
              <p className="text-xs text-muted mb-1">{vouch.property_name} &mdash; {vouch.property_city}</p>
              <p className="text-xs text-muted line-clamp-2">&ldquo;{vouch.review}&rdquo;</p>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant={vouch.is_active ? "primary" : "ghost"}
                onClick={() => toggleActive(vouch.id)}
              >
                {vouch.is_active ? "Visible" : "Hidden"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
