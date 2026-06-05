import type { Metadata } from "next";
import { ServicesContent } from "@/components/services/ServicesContent";

export const metadata: Metadata = {
  title: "Layanan AI Pesat.AI | 33 Solusi AI untuk Bisnis Indonesia",
  description:
    "Katalog lengkap layanan AI Pesat.AI: naikkan revenue, efisiensi biaya, prediksi & forecast, akurasi keputusan, plus GEO AI search dan Digital Reputation Asset (DRA).",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Layanan AI Pesat.AI | 33 Solusi AI untuk Bisnis",
    description: "Cari dan filter 33 layanan AI siap pakai — dari AI Sales Assistant sampai GEO & DRA.",
    url: "/services",
    siteName: "Pesat.AI",
    type: "website"
  }
};

export default function ServicesPage() {
  return <ServicesContent />;
}
