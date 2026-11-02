"use client";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { FeaturedIn } from "@/components/home/sections/FeaturedIn";
import { HeroOffer } from "./HeroOffer";
import { PainPointsOffer } from "./PainPointsOffer";
import { SolutionsOffer } from "./SolutionsOffer";
import { ResultsOffer } from "./ResultsOffer";
import { DiscoveryFormOffer } from "./DiscoveryFormOffer";

const WHATSAPP_URL = "https://wa.me/6281290401240";

function goToWhatsApp() {
  if (typeof window !== "undefined") {
    window.location.href = WHATSAPP_URL;
  }
}

export function OfferPage() {
  return (
    <>
      <Header onStartWizard={goToWhatsApp} />
      <main>
        <HeroOffer />
        <FeaturedIn />
        <PainPointsOffer />
        <SolutionsOffer />
        <ResultsOffer />
        <DiscoveryFormOffer />
      </main>
      <Footer onStartWizard={goToWhatsApp} />
    </>
  );
}

export default OfferPage;
