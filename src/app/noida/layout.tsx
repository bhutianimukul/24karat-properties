import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties in Noida & Greater Noida",
  description:
    "Explore flats, commercial shops, villas, and plots across Noida, Greater Noida West, and Greater Noida. AI-powered property analysis and investment insights.",
  keywords: ["Noida property", "Greater Noida flats", "Noida real estate", "Jewar Airport", "Noida Extension"],
};

export default function NoidaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
