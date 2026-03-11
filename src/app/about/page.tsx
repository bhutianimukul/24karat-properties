import { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Kawal Dua — Founder of 24 Karat Properties with 13+ years of real estate experience across Noida, Dholera & Pan India.",
};

const expertise = [
  "Residential Flats & Apartments",
  "Commercial Shops & Retail Spaces",
  "Investor Advisory & Portfolio Building",
  "New Launch & Pre-Launch Opportunities",
  "Market Analysis – Noida, Greater Noida, Dholera & Pan-India",
  "Deal Negotiation & Price Discovery",
  "Legal Verification & Documentation",
  "Registry, Loan & Post-Purchase Support",
];

const stats = [
  { value: "13+", label: "Years in Real Estate" },
  { value: "1000+", label: "Happy Families" },
  { value: "Pan India", label: "Network Reach" },
  { value: "100%", label: "Transparent Deals" },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <ScrollReveal className="text-center mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">
          About <span className="text-gold-gradient">24 Karat Properties</span>
        </h1>
      </ScrollReveal>

      {/* Company Section */}
      <ScrollReveal delay={0.1}>
      <Card className="p-6 sm:p-10 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#111118] to-[#08080c] border border-gold/30 flex items-center justify-center relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36" fill="none">
              <path d="M18 5 L27 15 L18 31 L9 15 Z" fill="url(#aboutGold)" opacity="0.15"/>
              <path d="M18 5 L27 15 L18 31 L9 15 Z" stroke="url(#aboutGold)" strokeWidth="0.6" opacity="0.3"/>
              <line x1="9" y1="15" x2="27" y2="15" stroke="url(#aboutGold)" strokeWidth="0.4" opacity="0.2"/>
              <defs>
                <linearGradient id="aboutGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0d78c"/>
                  <stop offset="50%" stopColor="#d4a853"/>
                  <stop offset="100%" stopColor="#9a7b2d"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="relative text-xs font-black bg-gradient-to-r from-[#d4a853] via-[#f5e6b8] to-[#d4a853] bg-clip-text text-transparent tracking-wide">24K</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">The Company</h2>
            <p className="text-sm text-muted">Est. 2021 &bull; Greater Noida West &bull; Open 7 Days</p>
          </div>
        </div>
        <div className="space-y-3 text-sm text-muted leading-relaxed">
          <p>
            What started as a one-man consultancy — powered by <strong className="text-foreground">13+ years of real estate experience</strong> and
            a deep network of industry connections — has grown into one of the most trusted property consulting firms
            in the Noida-Greater Noida region.
          </p>
          <p>
            <strong className="text-foreground">24 Karat Properties</strong> was established in 2021 with a simple belief:
            buying a property should feel safe, transparent, and supported at every step. We help families, first-time
            buyers, NRIs, and seasoned investors find the right property — whether it&apos;s a flat in Noida, a commercial
            shop in Greater Noida, or a plot in Dholera Smart City.
          </p>
          <p>
            We&apos;ve built strong relationships with builders, property lawyers, banking officers, sub-registrar offices,
            and interior designers — so when you work with us, you get access to an entire ecosystem, not just a broker.
            Walk into our office at <strong className="text-foreground">Gulshan Bellina, Sector 16, Greater Noida West</strong> any day of the week,
            or connect on WhatsApp — we&apos;re always available.
          </p>
        </div>
      </Card>
      </ScrollReveal>

      {/* Company Quick Stats + Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StaggerContainer className="grid grid-cols-2 gap-4">
          {[
            { value: "Est. 2021", label: "Founded" },
            { value: "7 Days", label: "Office Open" },
            { value: "Noida HQ", label: "Headquartered" },
            { value: "Pan India", label: "Network" },
          ].map((item) => (
            <StaggerItem key={item.label}>
            <Card className="p-4 text-center">
              <div className="text-lg font-bold text-gold">{item.value}</div>
              <div className="text-xs text-muted mt-0.5">{item.label}</div>
            </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.2!2d77.4522601!3d28.6085845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef5f99407105%3A0x69a274e3d24fd8c2!2sGulshan%20Bellina!5e0!3m2!1sen!2sin!4v1710000000000"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 200 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl border border-surface-border h-full"
            title="Office Location - Gulshan Bellina, Noida"
          />
        </div>
      </div>

      {/* Meet the Founder */}
      <ScrollReveal className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-muted border border-gold/20">
          <span className="text-sm text-gold">Meet the Founder</span>
        </div>
      </ScrollReveal>

      {/* Founder Card */}
      <ScrollReveal delay={0.1}>
      <Card className="p-6 sm:p-10 mb-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo */}
          <div className="shrink-0 mx-auto md:mx-0">
            <Image
              src="/images/kawal.png"
              alt="Kawal Dua - Founder, 24 Karat Properties"
              width={160}
              height={160}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-2 border-gold/30 object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Kawal Dua</h2>
            <p className="text-gold font-medium mb-1">Founder &amp; Director</p>
            <p className="text-sm text-muted mb-4">
              13+ Years in Real Estate &bull; Noida &bull; Dholera &bull; Pan India
            </p>

            {/* Contact */}
            <div className="flex flex-wrap gap-2 mb-4">
              <a
                href="tel:+919582806827"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-light border border-surface-border rounded-lg text-xs sm:text-sm hover:border-gold/50 hover:text-gold transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="truncate">+91 95828 06827</span>
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&to=kawal.dua56@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-light border border-surface-border rounded-lg text-xs sm:text-sm hover:border-gold/50 hover:text-gold transition-colors min-w-0"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">kawal.dua56@gmail.com</span>
              </a>
            </div>

            {/* Socials — single line */}
            <div className="flex items-center gap-2 mb-6">
              <a
                href={`https://wa.me/919582806827?text=${encodeURIComponent("Hi Kawal, I'm interested in property consultation.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/10 border border-[#25D366]/20 rounded-lg text-sm text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/kawal.dua56/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E4405F]/10 border border-[#E4405F]/20 rounded-lg text-sm text-[#E4405F] hover:bg-[#E4405F]/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/kawal-dua-918562290/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-lg text-sm text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>

            {/* Bio */}
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                With over <strong className="text-foreground">13 years in the real estate industry</strong>, I&apos;ve built 24 Karat Properties on a simple principle —
                every client deserves complete transparency, honest guidance, and support that doesn&apos;t end at the deal.
              </p>
              <p>
                I specialize in residential flats and commercial shop investments across Noida, Greater Noida West,
                Dholera Smart City, and several high-growth corridors across India. From first-time homebuyers to
                seasoned investors building portfolios, I work closely with each client to find properties that match
                their goals — not just their budget.
              </p>
              <p>
                Over the years, I&apos;ve built <strong className="text-foreground">deep connections across the entire property ecosystem</strong> —
                experienced property lawyers for title verification, bank officers at SBI, HDFC, ICICI for fast loan approvals,
                reliable contacts at sub-registrar offices for smooth registry, and partnerships with reputed builders
                for priority allotment and best pricing. Even after the deal closes, we help with interior coordination,
                society transfers, mutation, and property management.
              </p>
              <p>
                When you work with 24 Karat, you don&apos;t just get a property consultant — you get access to an
                entire network of trusted professionals who ensure your journey from search to settlement is seamless.
              </p>
            </div>
          </div>
        </div>
      </Card>
      </ScrollReveal>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
          <Card className="p-5 text-center">
            <div className="text-3xl font-bold text-gold mb-1">{stat.value}</div>
            <div className="text-xs text-muted">{stat.label}</div>
          </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Key Expertise */}
      <ScrollReveal>
      <Card className="p-6 sm:p-8 mb-10">
        <h3 className="text-xl font-bold mb-6">
          Key <span className="text-gold-gradient">Expertise</span>
        </h3>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {expertise.map((item) => (
            <StaggerItem key={item}>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 mt-0.5 shrink-0 rounded-full bg-gold-muted flex items-center justify-center">
                <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-muted">{item}</span>
            </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Card>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
      <Card className="p-8 text-center bg-gradient-to-br from-surface to-surface-light">
        <h3 className="text-2xl font-bold mb-3">
          Ready to find your <span className="text-gold-gradient">perfect property</span>?
        </h3>
        <p className="text-sm text-muted mb-6 max-w-md mx-auto">
          Get in touch with Kawal for a free consultation. 13+ years of experience, strong industry connections, and a commitment to transparent dealing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={`https://wa.me/919582806827?text=${encodeURIComponent("Hi Kawal, I'd like a free property consultation.")}`} target="_blank" rel="noopener noreferrer">
            <Button size="lg">Chat on WhatsApp</Button>
          </a>
          <a href="tel:+919582806827">
            <Button variant="secondary" size="lg">Call Now</Button>
          </a>
        </div>
      </Card>
      </ScrollReveal>
    </div>
  );
}
