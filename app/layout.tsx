import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/home/ThemeProvider";

// Body / UI — premium humanist geometric (SF-Pro-adjacent, not the over-used Inter)
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"]
});

// Display / headings — geometric "tech" grotesk for a high-end, modern feel
const display = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Pesat.AI | Buktikan Sendiri dalam 5 Menit",
  description: "Mini session untuk membuktikan peluang AI, otomasi, omset, biaya, kas & stok, dan risiko operasional di bisnis Anda.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pesat.ai"),
  openGraph: {
    title: "Pesat.AI | Buktikan Sendiri dalam 5 Menit",
    description: "Lihat potensi impact AI untuk bisnis Anda tanpa signup dan tanpa kartu kredit.",
    url: "/",
    siteName: "Pesat.AI",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff"
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('pesat-theme-4');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
