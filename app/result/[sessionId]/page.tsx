import type { Metadata } from "next";
import { ResultView } from "@/components/ResultView";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Laporan Diagnosis Solusi AI Bisnis | Pesat.AI",
    description: "Hasil diagnostic mini session dan rekomendasi solusi AI operasional terpersonalisasi dari Pesat.AI.",
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function ResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <ResultView sessionId={sessionId} />;
}
