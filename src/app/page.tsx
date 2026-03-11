import { Hero } from "@/components/home/Hero";
import { CitySelector } from "@/components/home/CitySelector";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { VouchSlider } from "@/components/home/VouchSlider";
import { PropertyNews } from "@/components/home/PropertyNews";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CitySelector />
      <FeaturedProperties />
      <WhyChooseUs />
      <PropertyNews />
      <VouchSlider />
    </>
  );
}
