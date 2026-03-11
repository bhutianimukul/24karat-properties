"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background" />

      {/* Animated gold accent orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gold/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-gold/3 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gold/4 rounded-full blur-2xl animate-float-slow" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Blessing Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-muted border border-gold/20 mb-6"
          >
            <span className="text-sm text-gold font-medium tracking-wide">&#x2727; Jai Shree Radhe &#x2727;</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold leading-tight mb-5 sm:mb-6">
            Find Your Perfect{" "}
            <span className="text-gold-gradient">Property</span>
            <br />
            <span className="text-2xl sm:text-4xl md:text-5xl">With Trusted Guidance</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-muted max-w-2xl mx-auto mb-4 px-2">
            Premium properties across Noida, Greater Noida &amp; Dholera. 13+ years of experience,
            end-to-end support from search to registry and beyond.
          </p>

          {/* AI badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-muted border border-gold/20 mb-8"
          >
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-gold font-medium">AI-Powered Property Analysis</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link href="/noida" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto animate-glow-pulse">
                Explore Properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
            <Link href="/compare" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto border-gold/30 text-gold hover:bg-gold/10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Compare Properties
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats — animated counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-12 sm:mt-16"
        >
          {[
            { value: "13+", label: "Years Experience" },
            { value: "1000+", label: "Happy Families" },
            { value: "AI", label: "Powered Analysis" },
            { value: "24/7", label: "WhatsApp Support" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              className="text-center p-3 rounded-xl bg-surface/50 border border-surface-border/50 backdrop-blur-sm"
            >
              <div className="text-xl sm:text-3xl font-bold text-gold">{stat.value}</div>
              <div className="text-[10px] sm:text-sm text-muted mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
