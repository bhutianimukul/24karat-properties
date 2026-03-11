"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import type { Property } from "@/types/property";
import Link from "next/link";

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/properties")
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const totalProperties = properties.length;
  const featuredCount = properties.filter((p) => p.is_featured).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted">Overview of your property portal</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Link href="/admin/properties">
          <Card hover className="p-4">
            <p className="text-2xl font-bold">{loading ? "..." : totalProperties}</p>
            <p className="text-xs text-muted">Total Properties</p>
          </Card>
        </Link>
        <Link href="/admin/properties">
          <Card hover className="p-4">
            <p className="text-2xl font-bold text-gold">{loading ? "..." : featuredCount}</p>
            <p className="text-xs text-muted">Featured</p>
          </Card>
        </Link>
      </div>

      {/* Recent Properties */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Properties</h2>
          <Link href="/admin/properties" className="text-xs text-gold hover:text-gold-light">View all</Link>
        </div>
        {loading ? (
          <p className="text-sm text-muted py-8 text-center">Loading...</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-left">
                <th className="pb-2 text-muted font-medium text-xs">Title</th>
                <th className="pb-2 text-muted font-medium text-xs">City</th>
                <th className="pb-2 text-muted font-medium text-xs">Price</th>
                <th className="pb-2 text-muted font-medium text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {properties.slice(0, 5).map((p) => (
                <tr key={p.id} className="border-b border-surface-border/50">
                  <td className="py-2.5 pr-4">
                    <Link href={`/property/${p.slug}`} className="hover:text-gold transition-colors">{p.title}</Link>
                  </td>
                  <td className="py-2.5 pr-4 text-muted capitalize">{p.city_id}</td>
                  <td className="py-2.5 pr-4 text-gold font-medium">
                    {p.price >= 10000000 ? `${(p.price / 10000000).toFixed(2)} Cr` : `${(p.price / 100000).toFixed(1)} L`}
                  </td>
                  <td className="py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.status === "active" ? "bg-success/10 text-success" : "bg-muted/10 text-muted"
                    }`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/admin/properties">
          <Card hover className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-muted flex items-center justify-center text-gold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Add Property</p>
              <p className="text-xs text-muted">Create new listing</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/testimonials">
          <Card hover className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-muted flex items-center justify-center text-gold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Manage Testimonials</p>
              <p className="text-xs text-muted">Toggle featured vouches</p>
            </div>
          </Card>
        </Link>
        <Link href="/admin/videos">
          <Card hover className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-muted flex items-center justify-center text-gold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Manage Videos</p>
              <p className="text-xs text-muted">City highlight videos</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
