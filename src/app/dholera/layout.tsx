import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties in Dholera Smart City",
  description:
    "Invest in India's first greenfield smart city. Plots and properties in Dholera SIR with international airport, DMIC corridor, and 15-25% annual appreciation.",
  keywords: ["Dholera property", "Dholera Smart City", "Dholera investment", "Dholera SIR", "Gujarat real estate"],
};

export default function DholeraLayout({ children }: { children: React.ReactNode }) {
  return children;
}
