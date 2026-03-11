import { Hero } from "@/components/home/Hero";
import { CitySelector } from "@/components/home/CitySelector";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { VouchSlider } from "@/components/home/VouchSlider";
import { PropertyNews } from "@/components/home/PropertyNews";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "24 Karat Properties",
  url: "https://24karat-properties.vercel.app",
  telephone: "+919582806827",
  email: "kawal.dua56@gmail.com",
  founder: { "@type": "Person", name: "Kawal Dua", jobTitle: "Founder & Director" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gulshan Bellina, Sector 16",
    addressLocality: "Greater Noida West",
    addressRegion: "Uttar Pradesh",
    postalCode: "201306",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: "Noida" },
    { "@type": "City", name: "Greater Noida" },
    { "@type": "City", name: "Dholera" },
  ],
  description: "AI-powered real estate consultancy in Noida, Greater Noida & Dholera Smart City. 13+ years of experience, 1000+ happy families.",
  openingHours: "Mo-Su 09:00-21:00",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Hero />
      <CitySelector />
      <FeaturedProperties />
      <WhyChooseUs />
      <PropertyNews />
      <VouchSlider />
    </>
  );
}
