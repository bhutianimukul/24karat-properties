"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Property, PropertyType, PropertyStatus } from "@/types/property";
import Link from "next/link";

const typeLabels: Record<PropertyType, string> = {
  flat: "Flat", villa: "Villa", plot: "Plot", shop: "Shop", office: "Office", warehouse: "Warehouse",
};

const statusColors: Record<PropertyStatus, string> = {
  active: "bg-success/10 text-success",
  draft: "bg-gold-muted text-gold",
  hidden: "bg-muted/10 text-muted",
  sold: "bg-danger/10 text-danger",
  rented: "bg-surface-light text-muted",
};

const facingOptions = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];

const amenityPresets = [
  "Swimming Pool", "Gym", "Parking", "Lift", "Security", "CCTV", "Power Backup",
  "Club House", "Garden", "Children's Play Area", "Jogging Track", "Indoor Games",
  "Fire Safety", "Intercom", "Rainwater Harvesting", "Gated Community",
];

function formatPrice(price: number) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return `${(price / 1000).toFixed(0)}K`;
}

// Noida areas
const noidaAreas = [
  { id: "sector-150", name: "Sector 150" },
  { id: "greater-noida-west", name: "Greater Noida West" },
  { id: "yamuna-expressway", name: "Yamuna Expressway" },
  { id: "pari-chowk", name: "Pari Chowk" },
  { id: "sector-16", name: "Sector 16" },
  { id: "sector-12", name: "Sector 12" },
  { id: "gaur-city", name: "Gaur City" },
  { id: "noida-extension", name: "Noida Extension" },
];

// Dholera areas
const dholeraAreas = [
  { id: "near-airport", name: "Near Airport" },
  { id: "tp-40", name: "TP-40" },
  { id: "tp-41", name: "TP-41" },
  { id: "expressway-belt", name: "Expressway Belt" },
  { id: "activation-zone", name: "Activation Zone" },
];

const defaultCoords: Record<string, { lat: number; lng: number }> = {
  noida: { lat: 28.57, lng: 77.39 },
  dholera: { lat: 22.25, lng: 72.19 },
};

type FormErrors = Record<string, string>;

interface ImageEntry {
  id: string;
  file: File | null;
  preview: string; // local blob URL or existing remote URL
  url?: string; // uploaded remote URL
  alt_text: string;
  is_primary: boolean;
}

const initialForm = {
  title: "",
  city_id: "noida",
  area_id: "",
  property_type: "flat" as PropertyType,
  transaction_type: "sell" as "sell" | "rent",
  price: "",
  area_sqft: "",
  bedrooms: "",
  bathrooms: "",
  floor_number: "",
  total_floors: "",
  facing: "",
  year_built: "",
  possession_date: "",
  address: "",
  description: "",
  amenities: [] as string[],
  is_featured: false,
  latitude: "",
  longitude: "",
};

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterTransaction, setFilterTransaction] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [customAmenity, setCustomAmenity] = useState("");
  const [customDetails, setCustomDetails] = useState<{ key: string; value: string }[]>([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [locationSearching, setLocationSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: string; lng: string } | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  function fetchProperties() {
    setLoading(true);
    fetch("/api/admin/properties")
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }

  const filtered = properties.filter((p) => {
    if (filterCity !== "all" && p.city_id !== filterCity) return false;
    if (filterType !== "all" && p.property_type !== filterType) return false;
    if (filterTransaction !== "all" && p.transaction_type !== filterTransaction) return false;
    return true;
  });

  const areas = form.city_id === "dholera" ? dholeraAreas : noidaAreas;

  // --- Image Handling ---
  async function uploadImage(file: File, propertyId?: string, sortOrder?: number, isPrimary?: boolean, altText?: string): Promise<{ url: string; id?: string }> {
    const fd = new FormData();
    fd.append("file", file);
    if (propertyId) fd.append("property_id", propertyId);
    fd.append("sort_order", String(sortOrder ?? 0));
    fd.append("is_primary", String(isPrimary ?? false));
    if (altText) fd.append("alt_text", altText);
    const res = await fetch("/api/admin/images", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Image upload failed");
    return res.json();
  }

  function handleImageFiles(files: FileList | null) {
    if (!files) return;
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const validFiles: File[] = [];
    const rejected: string[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        rejected.push(`${file.name}: not an image`);
      } else if (file.size > MAX_SIZE) {
        rejected.push(`${file.name}: exceeds 5MB (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (rejected.length > 0) {
      alert(`Skipped:\n${rejected.join("\n")}`);
    }

    const newImages: ImageEntry[] = validFiles.map((file, i) => ({
      id: `img-${Date.now()}-${i}`,
      file,
      preview: URL.createObjectURL(file),
      alt_text: "",
      is_primary: images.length === 0 && i === 0,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const removed = prev.find((i) => i.id === id);
      if (removed?.file && removed?.preview) URL.revokeObjectURL(removed.preview);
      const next = prev.filter((i) => i.id !== id);
      if (next.length > 0 && !next.some((i) => i.is_primary)) {
        next[0].is_primary = true;
      }
      return next;
    });
  }

  function setPrimaryImage(id: string) {
    setImages((prev) => prev.map((i) => ({ ...i, is_primary: i.id === id })));
  }

  // --- Amenity Handling ---
  function toggleAmenity(a: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));
  }

  function addCustomAmenity() {
    const trimmed = customAmenity.trim();
    if (trimmed && !form.amenities.includes(trimmed)) {
      setForm((prev) => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
      setCustomAmenity("");
    }
  }

  // --- Custom Details ---
  function addCustomDetail() {
    setCustomDetails((prev) => [...prev, { key: "", value: "" }]);
  }

  function updateCustomDetail(idx: number, field: "key" | "value", val: string) {
    setCustomDetails((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: val } : d)));
  }

  function removeCustomDetail(idx: number) {
    setCustomDetails((prev) => prev.filter((_, i) => i !== idx));
  }

  // --- Location Search (Nominatim) ---
  async function searchLocation() {
    if (!locationQuery.trim()) return;
    setLocationSearching(true);
    setLocationResults([]);
    try {
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(locationQuery.trim())}`);
      const data = await res.json();
      setLocationResults(data);
    } catch {
      setLocationResults([]);
    } finally {
      setLocationSearching(false);
    }
  }

  function pickLocation(result: { display_name: string; lat: string; lon: string }) {
    setSelectedLocation({ name: result.display_name, lat: result.lat, lng: result.lon });

    // Auto-detect city from coordinates
    const lat = Number(result.lat);
    const isNoida = lat > 25; // India: Noida ~28.5, Dholera ~22.2
    const detectedCity = isNoida ? "noida" : "dholera";
    const cityAreas = detectedCity === "dholera" ? dholeraAreas : noidaAreas;

    // Auto-detect area by matching location name against known area names
    const locationLower = result.display_name.toLowerCase();
    const matchedArea = cityAreas.find((a) =>
      locationLower.includes(a.name.toLowerCase()) ||
      a.name.toLowerCase().split(" ").every((word) => locationLower.includes(word))
    );

    setForm((prev) => ({
      ...prev,
      latitude: result.lat,
      longitude: result.lon,
      city_id: detectedCity,
      ...(matchedArea ? { area_id: matchedArea.id } : {}),
      // Also fill address if empty
      ...(!prev.address ? { address: result.display_name.split(",").slice(0, 3).join(",").trim() } : {}),
    }));
    setLocationResults([]);
    setLocationQuery("");
  }

  function clearLocation() {
    setSelectedLocation(null);
    setForm((prev) => ({ ...prev, latitude: "", longitude: "" }));
  }

  // Parse Google Maps link for coordinates
  function parseGoogleMapsLink(link: string): { lat: string; lng: string } | null {
    // Matches @lat,lng or !3dlat!4dlng patterns
    const atMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) return { lat: atMatch[1], lng: atMatch[2] };
    const dMatch = link.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (dMatch) return { lat: dMatch[1], lng: dMatch[2] };
    // query param: q=lat,lng
    const qMatch = link.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) return { lat: qMatch[1], lng: qMatch[2] };
    return null;
  }

  function handleGoogleMapsLink(link: string) {
    const coords = parseGoogleMapsLink(link);
    if (!coords) return false;
    const lat = Number(coords.lat);
    const isNoida = lat > 25;
    const detectedCity = isNoida ? "noida" : "dholera";
    setSelectedLocation({ name: `From Google Maps (${coords.lat}, ${coords.lng})`, lat: coords.lat, lng: coords.lng });
    setForm((prev) => ({ ...prev, latitude: coords.lat, longitude: coords.lng, city_id: detectedCity }));
    return true;
  }

  // --- Validation ---
  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Valid price is required";
    if (!form.area_sqft || Number(form.area_sqft) <= 0) e.area_sqft = "Area is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.description?.trim()) e.description = "Description is required — use AI to generate one";

    // Only bedrooms/bathrooms required for flats/villas
    const type = form.property_type;
    if (["flat", "villa"].includes(type)) {
      if (!form.bedrooms) e.bedrooms = "Required for flats/villas";
      if (!form.bathrooms) e.bathrooms = "Required for flats/villas";
    }

    // Images required — minimum 1
    if (images.length === 0) e.images = "At least 1 image is required";

    return e;
  }

  // --- AI Description ---
  async function generateAIDescription() {
    if (!form.title && !form.address) return;
    setAiLoading(true);
    setAiSuggestion("");

    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          property_type: form.property_type,
          city: form.city_id,
          area: form.area_id,
          address: form.address,
          price: form.price,
          area_sqft: form.area_sqft,
          bedrooms: form.bedrooms,
          bathrooms: form.bathrooms,
          facing: form.facing,
          amenities: form.amenities,
          existing_description: form.description,
        }),
      });

      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      setAiSuggestion(data.description || "Could not generate description.");
    } catch {
      setAiSuggestion("AI unavailable — write description manually or try again later.");
    } finally {
      setAiLoading(false);
    }
  }

  function useAiSuggestion() {
    if (aiSuggestion && !aiSuggestion.startsWith("AI unavailable")) {
      setForm((prev) => ({ ...prev, description: aiSuggestion }));
      setAiSuggestion("");
    }
  }

  // --- Submit (Add or Edit) ---
  async function handleSubmitProperty() {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const coords = defaultCoords[form.city_id];

      // Auto-deduce area from address/location if not already set
      let areaId = form.area_id;
      if (!areaId) {
        const cityAreas = form.city_id === "dholera" ? dholeraAreas : noidaAreas;
        const searchText = (selectedLocation?.name || form.address).toLowerCase();
        const matched = cityAreas.find((a) =>
          searchText.includes(a.name.toLowerCase()) ||
          a.name.toLowerCase().split(" ").every((w) => searchText.includes(w))
        );
        areaId = matched?.id || (form.city_id === "dholera" ? "dholera-sir" : "greater-noida-west");
      }

      const propertyPayload = {
        city_id: form.city_id,
        area_id: areaId,
        title: form.title.trim(),
        description: form.description.trim() || null,
        property_type: form.property_type,
        transaction_type: form.transaction_type,
        price: Number(form.price),
        area_sqft: Number(form.area_sqft),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        floor_number: form.floor_number ? Number(form.floor_number) : null,
        total_floors: form.total_floors ? Number(form.total_floors) : null,
        facing: form.facing || null,
        year_built: form.year_built ? Number(form.year_built) : null,
        is_featured: form.is_featured,
        latitude: form.latitude ? Number(form.latitude) : coords.lat,
        longitude: form.longitude ? Number(form.longitude) : coords.lng,
        address: form.address.trim(),
        amenities: form.amenities,
        possession_date: form.possession_date ? `${form.possession_date}-01` : null,
      };

      let propertyId: string;

      if (editingId) {
        const res = await fetch(`/api/admin/properties/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(propertyPayload),
        });
        if (!res.ok) throw new Error("Failed to update property");
        const data = await res.json();
        propertyId = data.id;
      } else {
        const res = await fetch("/api/admin/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...propertyPayload, status: "hidden" }),
        });
        if (!res.ok) throw new Error("Failed to create property");
        const data = await res.json();
        propertyId = data.id;
      }

      // Upload any new images (ones that have a File object)
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.file) {
          await uploadImage(img.file, propertyId, i, img.is_primary, img.alt_text || form.title);
        }
      }

      cancelForm();
      fetchProperties();
    } catch (err) {
      alert(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleFeatured(id: string) {
    const prop = properties.find((p) => p.id === id);
    if (!prop) return;
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, is_featured: !p.is_featured } : p)));
    try {
      await fetch(`/api/admin/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !prop.is_featured }),
      });
    } catch {
      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, is_featured: prop.is_featured } : p)));
    }
  }

  async function toggleStatus(id: string) {
    const prop = properties.find((p) => p.id === id);
    if (!prop) return;
    const next: Record<PropertyStatus, PropertyStatus> = { active: "hidden", hidden: "active", draft: "active", sold: "active", rented: "active" };
    const newStatus = next[prop.status];
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    try {
      await fetch(`/api/admin/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status: prop.status } : p)));
    }
  }

  async function setPropertyStatus(id: string, status: PropertyStatus) {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    try {
      await fetch(`/api/admin/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      fetchProperties();
    }
  }

  async function deleteProperty(id: string) {
    if (!confirm("Delete this property?")) return;
    setProperties((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    } catch {
      fetchProperties();
    }
  }

  function startEdit(p: Property) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      city_id: p.city_id,
      area_id: p.area_id,
      property_type: p.property_type,
      transaction_type: p.transaction_type,
      price: String(p.price),
      area_sqft: String(p.area_sqft),
      bedrooms: p.bedrooms != null ? String(p.bedrooms) : "",
      bathrooms: p.bathrooms != null ? String(p.bathrooms) : "",
      floor_number: p.floor_number != null ? String(p.floor_number) : "",
      total_floors: p.total_floors != null ? String(p.total_floors) : "",
      facing: p.facing || "",
      year_built: p.year_built != null ? String(p.year_built) : "",
      possession_date: p.possession_date ? p.possession_date.slice(0, 7) : "",
      address: p.address,
      description: p.description || "",
      amenities: [...p.amenities],
      is_featured: p.is_featured,
      latitude: String(p.latitude),
      longitude: String(p.longitude),
    });
    setImages((p.images || []).map((img) => ({
      id: img.id,
      file: null,
      preview: img.url,
      url: img.url,
      alt_text: img.alt_text || "",
      is_primary: img.is_primary,
    })));
    setSelectedLocation({ name: p.address, lat: String(p.latitude), lng: String(p.longitude) });
    setCustomDetails([]);
    setShowForm(true);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setImages([]);
    setCustomDetails([]);
    setSelectedLocation(null);
    setErrors({});
    setAiSuggestion("");
  }

  const inputClass = (field: string) =>
    `w-full bg-surface-light border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${
      errors[field] ? "border-danger focus:border-danger" : "border-surface-border focus:border-gold/50"
    }`;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Properties</h1>
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Properties</h1>
          <p className="text-sm text-muted">{properties.length} total listings</p>
        </div>
        <Button onClick={() => showForm ? cancelForm() : setShowForm(true)}>
          {showForm ? "Cancel" : "+ Add Property"}
        </Button>
      </div>

      {/* ═══════ ADD PROPERTY FORM ═══════ */}
      {showForm && (
        <Card className="p-4 sm:p-6 space-y-6 overflow-hidden">
          <h3 className="font-bold text-lg">{editingId ? "Edit Property" : "New Property"}</h3>

          {Object.keys(errors).length > 0 && (
            <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3">
              <p className="text-xs text-danger font-medium">Please fix {Object.keys(errors).length} error(s) below before submitting.</p>
            </div>
          )}

          {/* ── Section 1: Basic Info ── */}
          <div>
            <p className="text-xs text-gold font-medium uppercase tracking-wider mb-3">Basic Info</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs text-muted mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="3BHK in ATS Pristine, Sector 150" className={inputClass("title")} />
                {errors.title && <p className="text-[10px] text-danger mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">City *</label>
                <select value={form.city_id} onChange={(e) => setForm({ ...form, city_id: e.target.value, area_id: "" })} className={inputClass("city_id")}>
                  <option value="noida">Noida / Greater Noida</option>
                  <option value="dholera">Dholera</option>
                </select>
              </div>
              {form.area_id && (
                <div>
                  <label className="block text-xs text-muted mb-1">Detected Area</label>
                  <div className="w-full bg-surface-light/50 border border-surface-border rounded-lg px-3 py-2 text-sm text-gold">
                    {areas.find((a) => a.id === form.area_id)?.name || form.area_id}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs text-muted mb-1">Type *</label>
                <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value as PropertyType })} className={inputClass("property_type")}>
                  {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Transaction *</label>
                <select value={form.transaction_type} onChange={(e) => setForm({ ...form, transaction_type: e.target.value as "sell" | "rent" })} className={inputClass("transaction_type")}>
                  <option value="sell">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Address *</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Sector 150, Noida" className={inputClass("address")} />
                {errors.address && <p className="text-[10px] text-danger mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* ── Section 2: Pricing & Size ── */}
          <div>
            <p className="text-xs text-gold font-medium uppercase tracking-wider mb-3">Pricing & Size</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Price (INR) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="5000000" className={inputClass("price")} />
                {form.price && <p className="text-[10px] text-gold mt-1">{formatPrice(Number(form.price))}</p>}
                {errors.price && <p className="text-[10px] text-danger mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Area (sqft) *</label>
                <input type="number" value={form.area_sqft} onChange={(e) => setForm({ ...form, area_sqft: e.target.value })}
                  placeholder="1200" className={inputClass("area_sqft")} />
                {errors.area_sqft && <p className="text-[10px] text-danger mt-1">{errors.area_sqft}</p>}
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Price/sqft</label>
                <div className="w-full bg-surface-light/50 border border-surface-border rounded-lg px-3 py-2 text-sm text-muted">
                  {form.price && form.area_sqft ? `₹${Math.round(Number(form.price) / Number(form.area_sqft)).toLocaleString("en-IN")}` : "Auto-calculated"}
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Possession Date</label>
                <input type="month" value={form.possession_date} onChange={(e) => setForm({ ...form, possession_date: e.target.value })}
                  className={inputClass("possession_date")} />
              </div>
            </div>
          </div>

          {/* ── Section 3: Property Details ── */}
          <div>
            <p className="text-xs text-gold font-medium uppercase tracking-wider mb-3">Property Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Bedrooms {["flat", "villa"].includes(form.property_type) ? "*" : ""}</label>
                <input type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                  placeholder="3" className={inputClass("bedrooms")} />
                {errors.bedrooms && <p className="text-[10px] text-danger mt-1">{errors.bedrooms}</p>}
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Bathrooms {["flat", "villa"].includes(form.property_type) ? "*" : ""}</label>
                <input type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                  placeholder="2" className={inputClass("bathrooms")} />
                {errors.bathrooms && <p className="text-[10px] text-danger mt-1">{errors.bathrooms}</p>}
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Floor</label>
                <input type="number" min="0" value={form.floor_number} onChange={(e) => setForm({ ...form, floor_number: e.target.value })}
                  placeholder="7" className={inputClass("floor_number")} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Total Floors</label>
                <input type="number" min="0" value={form.total_floors} onChange={(e) => setForm({ ...form, total_floors: e.target.value })}
                  placeholder="22" className={inputClass("total_floors")} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Facing</label>
                <select value={form.facing} onChange={(e) => setForm({ ...form, facing: e.target.value })} className={inputClass("facing")}>
                  <option value="">Select...</option>
                  {facingOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Year Built</label>
                <input type="number" min="1980" max={new Date().getFullYear() + 5} value={form.year_built}
                  onChange={(e) => setForm({ ...form, year_built: e.target.value })}
                  placeholder="2024" className={inputClass("year_built")} />
              </div>
            </div>

            {/* Custom Details */}
            <div className="mt-4 pt-4 border-t border-surface-border/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-muted">Custom Details</p>
                  <p className="text-[10px] text-muted">Add extra details like Balconies, Parking Spots, Furnishing, etc.</p>
                </div>
                <Button size="sm" variant="ghost" onClick={addCustomDetail}>+ Add Detail</Button>
              </div>

              {customDetails.length > 0 && (
                <div className="space-y-2">
                  {customDetails.map((detail, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input type="text" value={detail.key} onChange={(e) => updateCustomDetail(idx, "key", e.target.value)}
                        placeholder="Label (e.g. Balconies)" className="flex-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-gold/50" />
                      <input type="text" value={detail.value} onChange={(e) => updateCustomDetail(idx, "value", e.target.value)}
                        placeholder="Value (e.g. 2)" className="flex-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-gold/50" />
                      <button onClick={() => removeCustomDetail(idx)} className="text-danger text-xs hover:text-danger/80 cursor-pointer shrink-0 px-2">&times;</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Section 4: Images ── */}
          <div>
            <p className="text-xs text-gold font-medium uppercase tracking-wider mb-3">Images *</p>
            {errors.images && <p className="text-[10px] text-danger mb-2">{errors.images}</p>}

            {/* Image grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-3">
                {images.map((img) => (
                  <div key={img.id} className={`relative group rounded-lg border overflow-hidden aspect-square ${img.is_primary ? "border-gold ring-2 ring-gold/30" : "border-surface-border"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.preview} alt={img.alt_text || ""} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      {!img.is_primary && (
                        <button onClick={() => setPrimaryImage(img.id)} className="text-[10px] text-white bg-gold/80 px-2 py-0.5 rounded cursor-pointer">Cover</button>
                      )}
                      <button onClick={() => removeImage(img.id)} className="text-[10px] text-white bg-danger/80 px-2 py-0.5 rounded cursor-pointer">Remove</button>
                    </div>
                    {img.is_primary && <span className="absolute top-1 left-1 text-[8px] bg-gold text-background px-1.5 py-0.5 rounded font-medium">COVER</span>}
                  </div>
                ))}
              </div>
            )}

            {/* File picker */}
            <label className="block border-2 border-dashed border-surface-border rounded-lg p-6 text-center cursor-pointer hover:border-gold/30 transition-colors">
              <input type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => handleImageFiles(e.target.files)} />
              <svg className="w-8 h-8 text-muted mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-muted">Click to select images <span className="text-gold">(multiple allowed)</span></p>
              <p className="text-[10px] text-muted mt-1">Max 5MB each. First image becomes cover. Hover to change or remove.</p>
            </label>
          </div>

          {/* ── Section 5: Description + AI ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gold font-medium uppercase tracking-wider">Description *</p>
              <Button size="sm" variant="secondary" onClick={generateAIDescription} disabled={aiLoading || (!form.title && !form.address)}>
                {aiLoading ? (
                  <><span className="w-3 h-3 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /> Generating...</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> AI Suggest</>
                )}
              </Button>
            </div>

            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Describe the property — location advantages, features, construction quality..."
              className={inputClass("description") + " resize-none"} />
            {errors.description && <p className="text-[10px] text-danger mt-1">{errors.description}</p>}

            {aiSuggestion && (
              <div className="mt-3 bg-gold-muted border border-gold/20 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-[10px] text-gold font-medium uppercase tracking-wider">AI Suggestion</p>
                  <div className="flex gap-2">
                    <button onClick={useAiSuggestion} className="text-[10px] text-gold hover:underline cursor-pointer">Use this</button>
                    <button onClick={() => setAiSuggestion("")} className="text-[10px] text-muted hover:text-foreground cursor-pointer">Dismiss</button>
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed">{aiSuggestion}</p>
              </div>
            )}
          </div>

          {/* ── Section 6: Amenities ── */}
          <div className="min-w-0">
            <p className="text-xs text-gold font-medium uppercase tracking-wider mb-3">Amenities</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
              {amenityPresets.map((a) => (
                <button key={a} onClick={() => toggleAmenity(a)}
                  className={`px-2.5 py-1 text-[11px] sm:text-xs rounded-full border transition-colors cursor-pointer ${
                    form.amenities.includes(a)
                      ? "bg-gold/20 border-gold/40 text-gold"
                      : "bg-surface-light border-surface-border text-muted hover:border-gold/30"
                  }`}>
                  {form.amenities.includes(a) ? "✓ " : ""}{a}
                </button>
              ))}
            </div>
            {/* Custom amenities */}
            {form.amenities.filter((a) => !amenityPresets.includes(a)).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.amenities.filter((a) => !amenityPresets.includes(a)).map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gold/20 border border-gold/40 text-gold">
                    {a}
                    <button onClick={() => toggleAmenity(a)} className="hover:text-gold-light cursor-pointer">&times;</button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())}
                placeholder="Add custom amenity..." className="flex-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-gold/50" />
              <Button size="sm" variant="ghost" onClick={addCustomAmenity} disabled={!customAmenity.trim()}>Add</Button>
            </div>
          </div>

          {/* ── Section 7: Location (Map Search) ── */}
          <div>
            <p className="text-xs text-gold font-medium uppercase tracking-wider mb-3">Location <span className="text-muted font-normal normal-case">(search to pin on map — defaults to city center if skipped)</span></p>

            {selectedLocation ? (
              <div className="bg-surface-light border border-surface-border rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gold mb-0.5">Pinned Location</p>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">{selectedLocation.name}</p>
                    <p className="text-[10px] text-muted mt-1">{selectedLocation.lat}, {selectedLocation.lng}</p>
                  </div>
                  <button onClick={clearLocation} className="text-xs text-danger hover:text-danger/80 cursor-pointer shrink-0">Change</button>
                </div>
                {/* Map preview via iframe */}
                <div className="mt-3 rounded-lg overflow-hidden border border-surface-border h-[180px]">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(selectedLocation.lng) - 0.005},${Number(selectedLocation.lat) - 0.003},${Number(selectedLocation.lng) + 0.005},${Number(selectedLocation.lat) + 0.003}&layer=mapnik&marker=${selectedLocation.lat},${selectedLocation.lng}`}
                    className="w-full h-full border-0"
                    title="Location preview"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="flex gap-2">
                  <input type="text" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchLocation())}
                    placeholder="Search location... e.g. ATS Pristine Sector 150 Noida"
                    className="flex-1 bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
                  <Button size="sm" variant="secondary" onClick={searchLocation} disabled={locationSearching || !locationQuery.trim()}>
                    {locationSearching ? (
                      <span className="w-3 h-3 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </Button>
                </div>

                {locationResults.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {locationResults.map((r, i) => (
                      <div key={i} className="bg-surface border border-surface-border rounded-xl overflow-hidden hover:border-gold/30 transition-colors">
                        <button onClick={() => pickLocation(r)}
                          className="w-full text-left px-4 py-2.5 cursor-pointer hover:bg-surface-light transition-colors">
                          <p className="text-xs text-foreground leading-relaxed line-clamp-2">{r.display_name}</p>
                          <p className="text-[10px] text-gold mt-0.5">Click to select this location</p>
                        </button>
                        <div className="h-[120px] border-t border-surface-border">
                          <iframe
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(r.lon) - 0.008},${Number(r.lat) - 0.005},${Number(r.lon) + 0.008},${Number(r.lat) + 0.005}&layer=mapnik&marker=${r.lat},${r.lon}`}
                            className="w-full h-full border-0"
                            title={`Preview: ${r.display_name}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {locationSearching && (
                  <p className="text-[10px] text-muted mt-2">Searching OpenStreetMap...</p>
                )}

                {/* Google Maps link fallback */}
                <div className="mt-3 pt-3 border-t border-surface-border/50">
                  <p className="text-[10px] text-muted mb-1.5">Or paste a Google Maps link</p>
                  <div className="flex gap-2">
                    <input type="url" id="gmaps-link" placeholder="https://maps.google.com/..."
                      className="flex-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-gold/50" />
                    <Button size="sm" variant="ghost" onClick={() => {
                      const input = document.getElementById("gmaps-link") as HTMLInputElement;
                      if (input?.value && handleGoogleMapsLink(input.value)) {
                        input.value = "";
                      } else if (input?.value) {
                        alert("Could not extract coordinates from this link. Try a different Google Maps URL.");
                      }
                    }}>Extract</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Featured Toggle ── */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-gold" />
            Mark as Featured on Homepage
          </label>

          {/* ── Submit ── */}
          <div className="flex items-center gap-3 pt-2 border-t border-surface-border">
            <Button onClick={handleSubmitProperty} disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Save Changes" : "Add Property"}
            </Button>
            <Button variant="ghost" onClick={cancelForm}>Cancel</Button>
            {Object.keys(errors).length > 0 && (
              <p className="text-xs text-danger">{Object.keys(errors).length} field(s) need attention</p>
            )}
          </div>
        </Card>
      )}

      {/* ═══════ FILTERS ═══════ */}
      <div className="flex flex-wrap gap-2">
        <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}
          className="bg-surface-light border border-surface-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gold/50">
          <option value="all">All Cities</option>
          <option value="noida">Noida</option>
          <option value="dholera">Dholera</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="bg-surface-light border border-surface-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gold/50">
          <option value="all">All Types</option>
          {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterTransaction} onChange={(e) => setFilterTransaction(e.target.value)}
          className="bg-surface-light border border-surface-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-gold/50">
          <option value="all">Sell & Rent</option>
          <option value="sell">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
      </div>

      {/* ═══════ PROPERTIES TABLE ═══════ */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-light border-b border-surface-border text-left">
                <th className="px-4 py-3 text-muted font-medium text-xs">Property</th>
                <th className="px-4 py-3 text-muted font-medium text-xs">City</th>
                <th className="px-4 py-3 text-muted font-medium text-xs">Type</th>
                <th className="px-4 py-3 text-muted font-medium text-xs">Price</th>
                <th className="px-4 py-3 text-muted font-medium text-xs">Status</th>
                <th className="px-4 py-3 text-muted font-medium text-xs">Featured</th>
                <th className="px-4 py-3 text-muted font-medium text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-surface-border/50 hover:bg-surface-light/50">
                  <td className="px-4 py-3">
                    <div>
                      <Link href={`/property/${p.slug}`} className="font-medium hover:text-gold transition-colors text-sm">{p.title}</Link>
                      <p className="text-xs text-muted truncate max-w-[200px]">{p.address}</p>
                      <p className="text-[10px] text-muted">{(p.images?.length || 0)} images</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted capitalize">{p.city_id}</td>
                  <td className="px-4 py-3"><Badge variant="muted">{typeLabels[p.property_type]}</Badge></td>
                  <td className="px-4 py-3 font-medium text-gold">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(p.id)} className="cursor-pointer">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[p.status]}`}>{p.status}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(p.id)} className="cursor-pointer">
                      <span className={`text-lg ${p.is_featured ? "text-gold" : "text-muted/30"}`}>{p.is_featured ? "\u2605" : "\u2606"}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(p)}>Edit</Button>
                      <Link href={`/property/${p.slug}`}><Button size="sm" variant="ghost">View</Button></Link>
                      {p.status !== "hidden" && (
                        <Button size="sm" variant="ghost" onClick={() => setPropertyStatus(p.id, "hidden")}>
                          <span className="text-muted">Hide</span>
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => { if (confirm("Mark as sold?")) setPropertyStatus(p.id, "sold"); }}>
                        <span className="text-danger">Sold</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">No properties match your filters.</div>
        )}
      </Card>
    </div>
  );
}
