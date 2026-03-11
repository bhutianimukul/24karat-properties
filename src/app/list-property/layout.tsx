import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Property",
  description:
    "Want to sell or rent your property? Submit your details and 24 Karat Properties will list it with professional photos and AI analysis.",
};

export default function ListPropertyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
