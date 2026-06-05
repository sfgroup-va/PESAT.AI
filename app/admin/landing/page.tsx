import type { Metadata } from "next";
import { LandingCmsDashboard } from "@/components/LandingCmsDashboard";

export const metadata: Metadata = {
  title: "Pesat.AI CMS — Landing Pages",
  robots: { index: false, follow: false }
};

export default function LandingCmsPage() {
  return <LandingCmsDashboard />;
}
