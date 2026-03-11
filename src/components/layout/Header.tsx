"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/noida", label: "Noida" },
  { href: "/dholera", label: "Dholera" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Vouches" },
];

const toolsLinks = [
  { href: "/tools/emi-calculator", label: "EMI Calculator" },
  { href: "/tools/investment-calculator", label: "Investment Calculator" },
  { href: "/tools/stamp-duty-calculator", label: "Stamp Duty Calculator" },
  { href: "/tools/rental-yield-calculator", label: "Rental Yield Calculator" },
  { href: "/tools/affordability-calculator", label: "Affordability Calculator" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setMobileToolsOpen(false);
  }, [pathname]);

  // Close tools dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Back + Logo */}
          <div className="flex items-center gap-1">
            {!isHome && (
              <button
                onClick={() => router.back()}
                className="md:hidden p-2 -ml-2 text-muted hover:text-gold active:text-gold transition-colors cursor-pointer rounded-lg hover:bg-surface-light active:bg-surface-light"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#111118] to-[#08080c] border border-gold/30 flex items-center justify-center relative overflow-hidden">
                {/* Diamond shape */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36" fill="none">
                  <path d="M18 5 L27 15 L18 31 L9 15 Z" fill="url(#headerGold)" opacity="0.15"/>
                  <path d="M18 5 L27 15 L18 31 L9 15 Z" stroke="url(#headerGold)" strokeWidth="0.6" opacity="0.3"/>
                  <line x1="9" y1="15" x2="27" y2="15" stroke="url(#headerGold)" strokeWidth="0.4" opacity="0.2"/>
                  <defs>
                    <linearGradient id="headerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f0d78c"/>
                      <stop offset="50%" stopColor="#d4a853"/>
                      <stop offset="100%" stopColor="#9a7b2d"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="relative text-[11px] font-black bg-gradient-to-r from-[#d4a853] via-[#f5e6b8] to-[#d4a853] bg-clip-text text-transparent tracking-wide">24K</span>
                {/* Sparkle */}
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#f5e6b8] opacity-70 blur-[0.5px]" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-gold-gradient">24 Karat</span>{" "}
                <span className="text-foreground hidden sm:inline">Properties</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm transition-colors rounded-lg ${
                  isActive(link.href)
                    ? "text-gold bg-gold/10"
                    : "text-muted hover:text-gold hover:bg-surface-light"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Tools Dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors rounded-lg cursor-pointer ${
                  pathname.startsWith("/tools")
                    ? "text-gold bg-gold/10"
                    : "text-muted hover:text-gold hover:bg-surface-light"
                }`}
              >
                Tools
                <svg className={`w-3 h-3 transition-transform ${toolsOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {toolsOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-surface border border-surface-border rounded-xl shadow-xl shadow-black/20 py-1 z-50">
                  {toolsLinks.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setToolsOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive(tool.href)
                          ? "text-gold bg-gold/10"
                          : "text-muted hover:text-gold hover:bg-surface-light"
                      }`}
                    >
                      {tool.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Link href="/compare">
              <Button variant="secondary" size="sm" className="border-gold/30 text-gold hover:bg-gold/10">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Compare
              </Button>
            </Link>
            <Link href="/list-property" className="inline-flex">
              <Button variant="secondary" size="sm" className="border-gold/30 text-gold hover:bg-gold/10">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">List Property</span>
                <span className="sm:hidden">List</span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-muted hover:text-foreground cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden pb-3 border-t border-surface-border pt-2 space-y-0.5 max-h-[60vh] overflow-y-auto" style={{ animation: "fade-up 0.25s ease-out" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-1.5 text-sm transition-colors rounded-lg ${
                  isActive(link.href)
                    ? "text-gold bg-gold/10"
                    : "text-muted hover:text-gold hover:bg-surface-light"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Collapsible Tools */}
            <button
              onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
              className={`flex items-center justify-between w-full px-3 py-1.5 text-sm transition-colors rounded-lg cursor-pointer ${
                pathname.startsWith("/tools")
                  ? "text-gold bg-gold/10"
                  : "text-muted hover:text-gold hover:bg-surface-light"
              }`}
            >
              Tools
              <svg className={`w-3.5 h-3.5 transition-transform ${mobileToolsOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileToolsOpen && (
              <div className="pl-4 space-y-0.5">
                {toolsLinks.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className={`block px-3 py-1.5 text-sm transition-colors rounded-lg ${
                      isActive(tool.href)
                        ? "text-gold bg-gold/10"
                        : "text-muted hover:text-gold hover:bg-surface-light"
                    }`}
                  >
                    {tool.label}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/compare"
              className={`block px-3 py-1.5 text-sm transition-colors rounded-lg ${
                isActive("/compare")
                  ? "text-gold bg-gold/10"
                  : "text-muted hover:text-gold hover:bg-surface-light"
              }`}
            >
              Compare
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
