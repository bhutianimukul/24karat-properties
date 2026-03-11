"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ListPropertyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    ownerName: "",
    phone: "",
    propertyType: "flat",
    city: "noida",
    address: "",
    area_sqft: "",
    price: "",
    bedrooms: "",
    description: "",
  });

  function handleSubmit() {
    if (!form.ownerName || !form.phone || !form.address) return;

    const msg = `Hi Kawal, I want to list my property:\n\nOwner: ${form.ownerName}\nPhone: ${form.phone}\nType: ${form.propertyType}\nCity: ${form.city}\nAddress: ${form.address}\nArea: ${form.area_sqft} sqft\nExpected Price: ₹${form.price}\nBedrooms: ${form.bedrooms || "N/A"}\n\n${form.description || ""}`;

    window.open(`https://wa.me/919582806827?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Listing Request Sent!</h1>
        <p className="text-sm text-muted mb-6">
          Kawal will review your property details and get back to you within 24 hours.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="/noida">
            <Button>Browse Properties</Button>
          </a>
          <Button variant="secondary" onClick={() => { setSubmitted(false); setForm({ ownerName: "", phone: "", propertyType: "flat", city: "noida", address: "", area_sqft: "", price: "", bedrooms: "", description: "" }); }}>
            List Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          List Your <span className="text-gold-gradient">Property</span>
        </h1>
        <p className="text-sm text-muted">
          Want to sell or rent your property? Submit your details and our team will list it on 24 Karat Properties with professional photos and AI analysis.
        </p>
      </div>

      <Card className="p-5 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Your Name *</label>
            <input type="text" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} placeholder="Full name" className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Phone Number *</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Property Type</label>
            <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50">
              <option value="flat">Flat / Apartment</option>
              <option value="villa">Villa / House</option>
              <option value="plot">Plot / Land</option>
              <option value="shop">Shop / Showroom</option>
              <option value="office">Office Space</option>
              <option value="warehouse">Warehouse / Godown</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">City</label>
            <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50">
              <option value="noida">Noida / Greater Noida</option>
              <option value="dholera">Dholera, Gujarat</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Property Address *</label>
          <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Society name, sector, city" className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Area (sqft)</label>
            <input type="number" value={form.area_sqft} onChange={(e) => setForm({ ...form, area_sqft: e.target.value })} placeholder="1200" className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Expected Price (INR)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="5000000" className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Bedrooms</label>
            <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} placeholder="3" className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Additional Details</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Any additional details about your property..." className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 resize-none" />
        </div>

        <Button onClick={handleSubmit} size="lg" className="w-full">
          Submit &amp; Connect on WhatsApp
        </Button>
        <p className="text-[10px] text-muted text-center">
          Your details will be sent via WhatsApp. We&apos;ll respond within 24 hours with a free property valuation.
        </p>
      </Card>
    </div>
  );
}
