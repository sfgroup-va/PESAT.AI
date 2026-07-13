import type { Metadata } from "next";
import { DepositEditor } from "@/components/DepositEditor";

export const metadata: Metadata = {
  title: "Pesat.AI Admin — Deposit",
  robots: { index: false, follow: false }
};

export const runtime = "nodejs";

export default function AdminDepositPage() {
  return <DepositEditor />;
}
