"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface HotLocation {
  name: string;
  tag: string;
}

interface CityData {
  id: string;
  name: string;
  meta: { hot_locations?: HotLocation[] } | null;
}

export default function AdminHotLocationsPage() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editCity, setEditCity] = useState<string | null>(null);
  const [locations, setLocations] = useState<HotLocation[]>([]);

  useEffect(() => {
    fetchCities();
  }, []);

  function fetchCities() {
    setLoading(true);
    fetch("/api/admin/cities")
      .then((r) => r.json())
      .then((data) => setCities(Array.isArray(data) ? data : []))
      .catch(() => setCities([]))
      .finally(() => setLoading(false));
  }

  function startEdit(city: CityData) {
    setEditCity(city.id);
    setLocations(city.meta?.hot_locations || []);
  }

  function cancelEdit() {
    setEditCity(null);
    setLocations([]);
  }

  function addLocation() {
    setLocations([...locations, { name: "", tag: "" }]);
  }

  function removeLocation(index: number) {
    setLocations(locations.filter((_, i) => i !== index));
  }

  function updateLocation(index: number, field: "name" | "tag", value: string) {
    setLocations(locations.map((loc, i) => (i === index ? { ...loc, [field]: value } : loc)));
  }

  async function handleSave() {
    if (!editCity) return;
    const valid = locations.filter((l) => l.name.trim());
    setSaving(editCity);
    try {
      await fetch("/api/admin/cities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city_id: editCity, hot_locations: valid }),
      });
      cancelEdit();
      fetchCities();
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(null);
    }
  }

  const inputClass = "w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50";

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Hot Locations</h1>
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Hot Locations</h1>
        <p className="text-sm text-muted">Manage the highlighted locations shown on each city page</p>
      </div>

      <p className="text-xs text-muted bg-surface-light border border-surface-border rounded-lg p-3">
        These appear as gold pill badges under &quot;🔥 Hot Locations&quot; on the Noida and Dholera pages. Each location has a name and a tag (e.g. &quot;Premium&quot;, &quot;Investment&quot;).
      </p>

      {cities.map((city) => {
        const isEditing = editCity === city.id;
        const cityLocations = city.meta?.hot_locations || [];

        return (
          <Card key={city.id} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">{city.name}</h2>
              {!isEditing && (
                <Button size="sm" onClick={() => startEdit(city)}>
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                {locations.map((loc, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={loc.name}
                      onChange={(e) => updateLocation(i, "name", e.target.value)}
                      placeholder="Location name (e.g. Sector 150)"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={loc.tag}
                      onChange={(e) => updateLocation(i, "tag", e.target.value)}
                      placeholder="Tag (e.g. Premium)"
                      className={`${inputClass} max-w-[150px]`}
                    />
                    <button
                      onClick={() => removeLocation(i)}
                      className="shrink-0 p-2 text-muted hover:text-danger transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}

                <button
                  onClick={addLocation}
                  className="flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Location
                </button>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} disabled={saving === city.id}>
                    {saving === city.id ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {cityLocations.length > 0 ? (
                  cityLocations.map((loc) => (
                    <span key={loc.name} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-gold/10 text-gold/90">
                      {loc.name} <span className="text-muted font-normal">· {loc.tag}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted">No hot locations set. Click Edit to add some.</span>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
