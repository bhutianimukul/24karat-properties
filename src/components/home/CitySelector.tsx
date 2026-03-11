"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

const cities = [
  {
    name: "Noida",
    slug: "noida",
    state: "Uttar Pradesh",
    description: "The hub of modern living — IT corridors, metro connectivity, world-class infrastructure.",
    highlights: ["Jewar Airport", "Aqua Line Metro", "Expressway Access"],
    propertyCount: "75+",
  },
  {
    name: "Dholera",
    slug: "dholera",
    state: "Gujarat",
    description: "India's first smart city — massive growth potential, government-backed infrastructure.",
    highlights: ["Smart City", "International Airport", "DMIC Corridor"],
    propertyCount: "30+",
  },
];

export function CitySelector() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Explore by <span className="text-gold-gradient">City</span>
        </h2>
        <p className="text-muted max-w-xl mx-auto">
          We operate in high-growth corridors with strong investment potential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cities.map((city, i) => (
          <motion.div
            key={city.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <Link href={`/${city.slug}`}>
              <Card hover className="p-5 sm:p-6 h-full group cursor-pointer relative overflow-hidden">
                {/* Subtle gold gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold group-hover:text-gold transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted">{city.state}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-bold text-gold">{city.propertyCount}</span>
                      <p className="text-[10px] sm:text-xs text-muted">Properties</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-muted mb-4 leading-relaxed">{city.description}</p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {city.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-2.5 py-0.5 sm:py-1 text-xs bg-gold-muted text-gold rounded-full border border-gold/20"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-sm text-gold sm:opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                    View Properties
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
