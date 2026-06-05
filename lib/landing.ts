// Landing page CMS model.
// A landing page reuses the homepage ("master") template and applies a config:
// which sections are visible, curated hero text overrides, and tracking pixels.
// The homepage itself is the read-only master and is NOT stored here.

export type LandingSectionKey =
  | "fomo"
  | "pillars"
  | "howItWorks"
  | "ctaLight"
  | "whyPesat"
  | "caseStudies"
  | "testimonial"
  | "pricing"
  | "ctaDark";

export const LANDING_SECTIONS: Array<{ key: LandingSectionKey; label: string }> = [
  { key: "fomo", label: "FOMO / Urgensi" },
  { key: "pillars", label: "6 Pilar Solusi" },
  { key: "howItWorks", label: "Cara Kerja" },
  { key: "ctaLight", label: "CTA (terang)" },
  { key: "whyPesat", label: "Kenapa Pesat.AI" },
  { key: "caseStudies", label: "Studi Kasus" },
  { key: "testimonial", label: "Testimoni" },
  { key: "pricing", label: "Harga" },
  { key: "ctaDark", label: "CTA penutup (gelap)" }
];

export type LandingOverrides = {
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  heroNote?: string;
};

export const LANDING_TEXT_SLOTS: Array<{ key: keyof LandingOverrides; label: string; placeholder: string }> = [
  { key: "heroBadge", label: "Badge atas hero", placeholder: "AI Revenue System untuk Bisnis Indonesia" },
  { key: "heroTitle", label: "Judul hero", placeholder: "Kalau Anda tidak pecat pekerjaan lama, AI akan pecat bisnis Anda." },
  { key: "heroSubtitle", label: "Subjudul hero", placeholder: "Satu orang kini bisa bangun bisnis jutaan dolar dengan AI. Masih puas dengan cara lama?" },
  { key: "heroCtaPrimary", label: "Tombol utama", placeholder: "Buktikan Sendiri dalam 5 Menit" },
  { key: "heroCtaSecondary", label: "Tombol kedua", placeholder: "Jadwalkan Discovery" },
  { key: "heroNote", label: "Catatan di bawah tombol", placeholder: "Gratis, tanpa signup, tanpa kartu kredit." }
];

export type LandingPixels = {
  googleId?: string;
  metaId?: string;
};

export type LandingConfig = {
  sections: Record<LandingSectionKey, boolean>;
  overrides: LandingOverrides;
  pixels: LandingPixels;
};

export type LandingPage = {
  slug: string;
  title: string;
  config: LandingConfig;
  createdAt?: string;
  updatedAt?: string;
};

export const DEFAULT_LANDING_CONFIG: LandingConfig = {
  sections: {
    fomo: true,
    pillars: true,
    howItWorks: true,
    ctaLight: true,
    whyPesat: true,
    caseStudies: true,
    testimonial: true,
    pricing: true,
    ctaDark: true
  },
  overrides: {},
  pixels: {}
};

// Reserved top-level paths that must never be used as a landing slug
// (they are real routes that would otherwise collide).
export const RESERVED_SLUGS = new Set<string>([
  "admin",
  "api",
  "services",
  "result",
  "robots.txt",
  "sitemap.xml",
  "icon.svg",
  "favicon.ico",
  "_next",
  "offer"
]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// gtag-compatible IDs: GA4 (G-), Google Ads (AW-), GT-, GTM-, legacy UA-.
const GOOGLE_PIXEL_RE = /^(G|AW|GT|GTM|UA)-[A-Z0-9-]{4,20}$/;
// Meta (Facebook) Pixel IDs are numeric.
const META_PIXEL_RE = /^[0-9]{6,20}$/;

export function isValidSlug(slug: string): boolean {
  return typeof slug === "string" && slug.length >= 1 && slug.length <= 60 && SLUG_RE.test(slug) && !RESERVED_SLUGS.has(slug);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Strict pixel sanitization — only well-formed IDs pass, so they are safe to
// interpolate into the gtag/fbq script snippets (no injection possible).
export function sanitizePixelGoogle(value: unknown): string {
  const raw = typeof value === "string" ? value.trim().toUpperCase() : "";
  return GOOGLE_PIXEL_RE.test(raw) ? raw : "";
}

export function sanitizePixelMeta(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  return META_PIXEL_RE.test(raw) ? raw : "";
}

export function sanitizeLandingConfig(input: unknown): LandingConfig {
  const obj = typeof input === "object" && input ? (input as Record<string, unknown>) : {};

  const sectionsIn = typeof obj.sections === "object" && obj.sections ? (obj.sections as Record<string, unknown>) : {};
  const sections = {} as Record<LandingSectionKey, boolean>;
  for (const { key } of LANDING_SECTIONS) {
    sections[key] = sectionsIn[key] === undefined ? true : Boolean(sectionsIn[key]);
  }

  const overridesIn = typeof obj.overrides === "object" && obj.overrides ? (obj.overrides as Record<string, unknown>) : {};
  const overrides: LandingOverrides = {};
  for (const { key } of LANDING_TEXT_SLOTS) {
    const val = overridesIn[key];
    if (typeof val === "string" && val.trim()) {
      overrides[key] = val.trim().slice(0, 240);
    }
  }

  const pixelsIn = typeof obj.pixels === "object" && obj.pixels ? (obj.pixels as Record<string, unknown>) : {};
  const pixels: LandingPixels = {};
  const googleId = sanitizePixelGoogle(pixelsIn.googleId);
  if (googleId) pixels.googleId = googleId;
  const metaId = sanitizePixelMeta(pixelsIn.metaId);
  if (metaId) pixels.metaId = metaId;

  return { sections, overrides, pixels };
}
