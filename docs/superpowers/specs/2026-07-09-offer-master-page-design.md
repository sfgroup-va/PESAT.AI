# Offer Master Page Design

Date: 2026-07-09
Topic: Add `/offer` as an editable, copyable master page in the Pesat.AI CMS

## Background

The CMS currently treats `/` (homepage) as the only read-only master. Custom landing pages can be cloned from the homepage master, edited via `LandingConfig`, and stored in `public.landing_pages`.

The `/offer` route exists as a separate hardcoded page built from custom components:
- `HeroOffer`
- `PainPointsOffer`
- `SolutionsOffer`
- `ResultsOffer`
- `DiscoveryFormOffer`

The user wants `/offer` to appear as a second master page in the CMS dashboard, so users can create editable copies based on the offer template.

## Goals

1. `/offer` appears as a master card in `/admin/landing` alongside the `/` homepage master.
2. Users can create new pages by duplicating either the homepage master or the offer master.
3. Offer-based pages can be edited in the CMS (section visibility + text overrides).
4. Offer pages are rendered using their own template and config, distinct from the homepage template.

## Non-Goals

- Changing the existing homepage behavior or `LandingConfig` shape.
- Migrating the hardcoded `/offer` route itself to DB-driven rendering (the master page `/offer` remains a hardcoded route; only its copies are stored in DB).
- Full visual/layout WYSIWYG editing (only text overrides and section toggles).

## Design

### Data Model

Add a `template` column to `public.landing_pages`:

```sql
ALTER TABLE public.landing_pages ADD COLUMN template text NOT NULL DEFAULT 'landing';
```

Valid values: `landing` | `offer`.

Backfill existing rows:

```sql
UPDATE public.landing_pages SET template = 'landing' WHERE template IS NULL;
```

The existing `config jsonb` column is reused for both templates; shape is validated per template.

### Config Models

Keep `LandingConfig` in `lib/landing.ts` unchanged.

Add `OfferConfig` in `lib/offer.ts` (or alongside `LandingConfig`):

```ts
type OfferSectionKey =
  | "hero"
  | "featuredIn"
  | "painPoints"
  | "solutions"
  | "results"
  | "discovery";

type OfferOverrides = {
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  heroNote?: string;
  painPointsTitle?: string;
  painPointsSubtitle?: string;
  painPointsHighlight?: string;
  solutionsTitle?: string;
  solutionsSubtitle?: string;
  resultsTitle?: string;
  resultsSubtitle?: string;
  discoveryTitle?: string;
  discoverySubtitle?: string;
  formCta?: string;
  whatsappNumber?: string;
};

type OfferConfig = {
  sections: Record<OfferSectionKey, boolean>;
  overrides: OfferOverrides;
  pixels: LandingPixels;
};
```

Default config:

```ts
const DEFAULT_OFFER_CONFIG: OfferConfig = {
  sections: {
    hero: true,
    featuredIn: true,
    painPoints: true,
    solutions: true,
    results: true,
    discovery: true,
  },
  overrides: {},
  pixels: {},
};
```

### Component Refactors

All `components/offer/*.tsx` components accept an optional overrides prop and fall back to their current hardcoded text when a value is not provided:

```ts
type HeroOfferProps = { overrides?: Pick<OfferOverrides, 'heroBadge' | 'heroTitle' | ...> };
```

Create `components/OfferExperience.tsx` that accepts `{ config: OfferConfig }` and renders the sections in order, respecting the `sections` map and passing overrides to each sub-component.

### Routing & Rendering

Update `app/[slug]/page.tsx` to read the page's `template` and render the correct experience:

```ts
if (page.template === 'offer') {
  return <OfferExperience config={page.config} />;
}
return <PesatExperience landing={page.config} />;
```

### CMS Dashboard

In `components/LandingCmsDashboard.tsx`:

1. Add a second master card for `/offer` with label "Master · Read-only" and a "Duplicate untuk Edit" button.
2. Change the "+ Buat Halaman Baru" flow to ask which master to clone: Homepage or Offer.
3. Display the template badge on each custom page card (`Landing` or `Offer`).

### CMS Editor

In `components/LandingEditor.tsx`:

1. Load the page's `template` from the API.
2. If `template === 'offer'`, show offer-specific section toggles and text overrides.
3. If `template === 'landing'`, keep the existing landing editor UI.
4. Preserve tracking pixel inputs for both templates.

### API Changes

`app/api/admin/landing/route.ts`:
- `GET`: include `template` in the response.
- `POST`: accept `template` and `config` (validate config shape per template).

`app/api/admin/landing/[slug]/route.ts`:
- `GET`: include `template` in the response.
- `PUT`: accept `template` (immutable in practice but useful for validation) and `config` (validate config shape per template).
- `DELETE`: unchanged.

`app/[slug]/page.tsx`:
- Load `template` alongside `title` and `config`.

### Migration

File: `supabase/migrations/20260709000000_offer_template.sql`

```sql
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS template text NOT NULL DEFAULT 'landing';
UPDATE public.landing_pages SET template = 'landing' WHERE template IS NULL;
```

### Validation & Sanitization

- Add `sanitizeOfferConfig(input: unknown): OfferConfig` mirroring `sanitizeLandingConfig`.
- In API routes, choose sanitizer based on `template`.
- Reject invalid templates with `400 Bad Request`.

### Security

- No changes to admin authentication (`x-admin-password` header via `ADMIN_PASSWORD`).
- Text overrides are sanitized/escaped by React rendering (no raw HTML insertion).
- Pixel IDs continue to use existing regex validation.

## Open Questions / Risks

1. **DB connection required**: The feature only works when `DATABASE_URL` is set; the dashboard already handles the missing-DB case with a 503 message.
2. **Migration timing**: If the production DB is already populated, the migration must run before the new code is deployed.
3. **Hardcoded `/offer` route**: The master `/offer` page itself remains a hardcoded Next.js route. Edits to the master config do not change the hardcoded `/offer` route; they only affect copies created from it. This is intentional and matches the existing homepage master pattern.

## Success Criteria

- `/admin/landing` shows two master cards: `/` and `/offer`.
- Clicking "Duplicate" on `/offer` creates a new page with `template: 'offer'` and `OfferConfig` defaults.
- The new page can be edited and previewed at `/<slug>`.
- The rendered page uses the offer sections and overrides.
- Existing landing pages continue to work unchanged.

## Files Expected to Change

- `lib/landing.ts` (add offer types/constants or import from new `lib/offer.ts`)
- `components/offer/HeroOffer.tsx`
- `components/offer/PainPointsOffer.tsx`
- `components/offer/SolutionsOffer.tsx`
- `components/offer/ResultsOffer.tsx`
- `components/offer/DiscoveryFormOffer.tsx`
- `components/OfferExperience.tsx` (new)
- `components/LandingCmsDashboard.tsx`
- `components/LandingEditor.tsx`
- `app/[slug]/page.tsx`
- `app/api/admin/landing/route.ts`
- `app/api/admin/landing/[slug]/route.ts`
- `supabase/migrations/20260709000000_offer_template.sql` (new)
