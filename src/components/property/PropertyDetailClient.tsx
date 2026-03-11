"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ImageCarousel } from "@/components/property/ImageCarousel";
import { PropertyMap } from "@/components/property/PropertyMap";
import { GoogleEarthEmbed } from "@/components/property/GoogleEarthEmbed";
import { AIInsightsPanel } from "@/components/property/AIInsightsPanel";
import type { Property } from "@/types/property";
import Link from "next/link";

function formatPrice(price: number) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return `${(price / 1000).toFixed(0)}K`;
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

const typeLabels: Record<string, string> = { flat: "Flat", villa: "Villa", plot: "Plot", shop: "Shop", office: "Office", warehouse: "Warehouse" };

export function PropertyDetailClient({ property }: { property: Property }) {
  const [showEMI, setShowEMI] = useState(false);
  const [loanAmount, setLoanAmount] = useState(0);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const effectiveLoan = loanAmount || property.price;

  const emi = useMemo(() => {
    if (!effectiveLoan) return 0;
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) return effectiveLoan / months;
    return (effectiveLoan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }, [effectiveLoan, rate, years]);

  const whatsappMsg = `Hi Kawal, I'm interested in this property:\n\n${property.title}\nPrice: ₹${formatPrice(property.price)}\nArea: ${property.area_sqft} sqft\nLocation: ${property.address}\n\nPlease share more details.`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted mb-4">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span>/</span>
        <Link href={`/${property.city_id}`} className="hover:text-gold">{property.city?.name || property.city_id}</Link>
        <span>/</span>
        <span className="text-foreground">{property.title}</span>
      </div>

      {/* Image Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl border border-surface-border mb-6 overflow-hidden"
      >
        <ImageCarousel images={property.images || []} aspect="16/9" />
        <div className="absolute top-3 left-3 flex gap-1.5 z-10 pointer-events-none">
          <Badge variant="gold">{typeLabels[property.property_type]}</Badge>
          {property.is_featured && <Badge variant="success">Featured</Badge>}
        </div>
      </motion.div>

      {/* AI Insights */}
      <AIInsightsPanel property={{
        title: property.title,
        property_type: property.property_type,
        city_id: property.city_id,
        city_name: property.city?.name || property.city_id,
        area_name: property.area?.name,
        address: property.address,
        price: property.price,
        area_sqft: property.area_sqft,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        facing: property.facing,
        amenities: property.amenities,
        year_built: property.year_built,
        ai_analysis: property.ai_analysis,
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Price */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h1 className="text-xl sm:text-2xl font-bold mb-1">{property.title}</h1>
            <p className="text-sm text-muted mb-3">{property.address}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gold">&#8377;{formatPrice(property.price)}</span>
              {property.price_per_sqft && (
                <span className="text-sm text-muted">&#8377;{property.price_per_sqft.toLocaleString("en-IN")}/sqft</span>
              )}
            </div>
          </motion.div>

          {/* Quick Details */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {property.bedrooms != null && (
              <Card className="p-3 text-center">
                <p className="text-lg font-bold text-gold">{property.bedrooms}</p>
                <p className="text-xs text-muted">Bedrooms</p>
              </Card>
            )}
            {property.bathrooms != null && (
              <Card className="p-3 text-center">
                <p className="text-lg font-bold text-gold">{property.bathrooms}</p>
                <p className="text-xs text-muted">Bathrooms</p>
              </Card>
            )}
            <Card className="p-3 text-center">
              <p className="text-lg font-bold text-gold">{property.area_sqft.toLocaleString("en-IN")}</p>
              <p className="text-xs text-muted">Sq.ft</p>
            </Card>
            {property.facing && (
              <Card className="p-3 text-center">
                <p className="text-lg font-bold text-gold">{property.facing}</p>
                <p className="text-xs text-muted">Facing</p>
              </Card>
            )}
          </motion.div>

          {/* Description */}
          <Card className="p-5">
            <h2 className="font-semibold mb-2">About this property</h2>
            <p className="text-sm text-muted leading-relaxed">{property.description}</p>
          </Card>

          {/* Details Table */}
          <Card className="p-5">
            <h2 className="font-semibold mb-3">Property Details</h2>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-6 text-sm">
              <div className="flex justify-between"><span className="text-muted">Type</span><span>{typeLabels[property.property_type]}</span></div>
              <div className="flex justify-between"><span className="text-muted">Transaction</span><span>{property.transaction_type === "sell" ? "For Sale" : "For Rent"}</span></div>
              {property.floor_number != null && <div className="flex justify-between"><span className="text-muted">Floor</span><span>{property.floor_number} of {property.total_floors}</span></div>}
              {property.year_built && <div className="flex justify-between"><span className="text-muted">Year Built</span><span>{property.year_built}</span></div>}
              {property.possession_date && <div className="flex justify-between"><span className="text-muted">Possession</span><span>{new Date(property.possession_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span></div>}
            </div>
          </Card>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <Card className="p-5">
              <h2 className="font-semibold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span key={a} className="px-3 py-1 text-xs bg-surface-light border border-surface-border rounded-full text-muted">{a}</span>
                ))}
              </div>
            </Card>
          )}

          {/* Location */}
          <Card className="p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-muted mb-2 uppercase tracking-wider font-medium">Street Map</p>
                <PropertyMap latitude={property.latitude} longitude={property.longitude} title={property.title} address={property.address} />
              </div>
              <div>
                <p className="text-[10px] text-muted mb-2 uppercase tracking-wider font-medium">Satellite View</p>
                <GoogleEarthEmbed latitude={property.latitude} longitude={property.longitude} title={property.title} />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5 sticky top-20">
            <h3 className="font-semibold mb-3">Interested?</h3>
            <div className="flex flex-col gap-2.5">
              <a href={`https://wa.me/919582806827?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer">
                <Button className="w-full" size="lg">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Inquiry
                </Button>
              </a>
              <a href="tel:+919582806827">
                <Button variant="secondary" className="w-full">Call +91 95828 06827</Button>
              </a>
            </div>

            {/* EMI Calculator */}
            <div className="mt-4 pt-4 border-t border-surface-border">
              <button onClick={() => setShowEMI(!showEMI)} className="flex items-center justify-between w-full text-sm font-medium cursor-pointer">
                <span>EMI Calculator</span>
                <span className="text-gold text-lg">{showEMI ? "\u2212" : "+"}</span>
              </button>

              {showEMI && (
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>Loan Amount</span>
                      <span>{formatINR(effectiveLoan)}</span>
                    </div>
                    <input type="range" min={500000} max={Math.max(property.price * 2, 10000000)} step={100000}
                      value={effectiveLoan}
                      onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full accent-gold" />
                    <div className="flex justify-between text-[10px] text-muted mt-0.5">
                      <span>5L</span>
                      <button onClick={() => setLoanAmount(property.price)} className="text-gold cursor-pointer hover:underline">Reset to property price</button>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>Rate</span><span>{rate}%</span>
                    </div>
                    <input type="range" min={6} max={12} step={0.25} value={rate}
                      onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-gold" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>Tenure</span><span>{years} yr</span>
                    </div>
                    <input type="range" min={5} max={30} value={years}
                      onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-gold" />
                  </div>
                  <div className="bg-surface-light rounded-lg p-3 text-center">
                    <p className="text-xs text-muted">Estimated EMI</p>
                    <p className="text-xl font-bold text-gold">{formatINR(Math.round(emi))}<span className="text-xs text-muted">/mo</span></p>
                  </div>
                  <a
                    href={`https://wa.me/919582806827?text=${encodeURIComponent(`Hi Kawal, I'm interested in:\n\n${property.title}\nPrice: ₹${formatPrice(property.price)}\nLocation: ${property.address}\n\nMy EMI estimate: ₹${Math.round(emi).toLocaleString("en-IN")}/mo (Loan: ${formatINR(effectiveLoan)}, ${rate}%, ${years}yr)\n\nCan you help with the best loan rates?`)}`}
                    target="_blank" rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="sm" className="w-full">Get Best Loan Rates</Button>
                  </a>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
