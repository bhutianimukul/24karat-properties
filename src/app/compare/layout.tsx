import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Properties",
  description:
    "Compare up to 3 properties side-by-side with AI-powered analysis. Get pros, cons, investment scores, and a clear winner recommendation.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
