import type { Metadata } from "next";
import { LandingEditor } from "@/components/LandingEditor";

export const metadata: Metadata = {
  title: "Pesat.AI CMS — Edit Landing",
  robots: { index: false, follow: false }
};

export default async function LandingEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LandingEditor slug={slug} />;
}
