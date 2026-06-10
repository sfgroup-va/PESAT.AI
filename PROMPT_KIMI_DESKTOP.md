# Prompt untuk Kimi Desktop — Pesat.AI Project

## Identitas Project
- **Nama:** Pesat.AI
- **Domain target:** pesat.ai (belum aktif, sekarang di workers.dev)
- **Tipe:** AI transformation consultancy untuk UMKM/bisnis Indonesia
- **Stack:** Next.js 16 + React + TypeScript + Tailwind CSS + Cloudflare Workers
- **Database:** Supabase / Neon PostgreSQL
- **Deploy:** GitHub Actions → Cloudflare Workers (auto-deploy tiap push ke `main`)

## Goals Utama (visi Pak Nell)
Pesat.AI harus terlihat seperti **pakar AI**, bukan survey generic:
1. **Quality Questions** — Pertanyaan wizard pakai metafor ("dashboard nyawa", "kegelapan", "Co-pilot AI")
2. **Loading Facts** — Insight singkat muncul saat transisi antar step (auto-advance 2.4 detik)
3. **Solusi WOW** — Result page harus akurat (dengan angka), visualisasi bagus, terukur
4. **Multiple Choice** — Semua pertanyaan single-select, tidak ada free text di tengah flow

## Apa yang Sudah Dikerjakan (Update Terbaru)

### ✅ P1: Quality Questions + Loading Overlay
- **File:** `components/PesatExperience.tsx`
- 4 pertanyaan quality questions di `lib/solutions.ts` (`QUALITY_QUESTIONS`)
- Single-select semua (S1-S4)
- Loading overlay dengan facts antar step (hapus step `fact1`/`fact2` terpisah)
- Progress bar di wizard

### ✅ P2: Result Page WOW Upgrade
- **File:** `components/PesatExperience.tsx` (ResultPanel), `components/ResultView.tsx`
- Executive Summary Hero: Before → After → Lift cards
- ROI Calculator interaktif (slider omzet 10jt - 5M)
- Solution Cards dengan: Impact Badge, Confidence Score, Setup Time, Proof Trail
- Bar chart before/after

### ✅ P3: Discovery Context (fitur dari commit remote)
- **File:** `components/PesatExperience.tsx`
- 3 pertanyaan opsional sebelum discovery call
- Word count limit untuk detail note (1000 kata) dan discovery context (120 kata)
- Word count display real-time

### ✅ Data Layer
- **File:** `lib/types.ts`, `lib/solutions.ts`, `lib/rule-engine.ts`, `lib/validation.ts`
- `SolutionCard` type dengan badge, setupTime, confidenceScore, proofBasis
- `buildSolutionCards()` menghasilkan cards dengan confidence 75-99%
- Backward-compatible ke database (arrays tetap arrays, tapi UI single-select)

## File Kunci yang Sering Diubah

| File | Fungsi |
|------|--------|
| `components/PesatExperience.tsx` | Wizard flow + ResultPanel (UI utama) |
| `components/ResultView.tsx` | Halaman `/result/[id]` untuk share |
| `lib/solutions.ts` | Data questions, solutions, challenge labels, transition facts |
| `lib/rule-engine.ts` | Logic: selectSolutions, buildResult, impact ranges, solution cards |
| `lib/types.ts` | TypeScript type definitions |
| `lib/openai-result.ts` | LLM enhancement (OpenAI) dengan anti-hallucination guards |
| `lib/validation.ts` | Sanitasi input, event validation |
| `app/api/result/route.ts` | API endpoint generate result |
| `.github/workflows/deploy.yml` | CI/CD ke Cloudflare |

## Cara Build & Test
```bash
# Build Next.js (wajib lolos sebelum commit)
npx next build

# Quality gate (CI menjalankan ini)
npm run check:quality

# Check supabase (kalau perlu)
npm run check:supabase -- -ProjectRef <ref>
```

## Coding Style
- **Tailwind:** gunakan utility classes, jangan custom CSS
- **Rounding:** `rounded-[1.35rem]` untuk cards, `rounded-full` untuk buttons
- **Colors:** `neutral-950` untuk primary, `neutral-200` untuk borders
- **Icons:** Lucide React (`lucide-react`)
- **Charts:** Recharts
- **TypeScript:** strict, tidak pakai `any`
- **Anti-hallucination:** angka di result HANYA dari `impactRanges` (tidak boleh diarang)

## Next Steps yang Bisa Dilanjutkan

### High Priority
1. **Money Clock** — Tampilkan "Setiap hari tanpa AI, Anda kehilangan Rp X" di result page
2. **Gauge Chart** — Efficiency meter (current vs AI-powered)
3. **A/B Test Copy** — Alternatif headline/pertanyaan untuk conversion optimization
4. **Mobile Polish** — Cek responsive di semua step wizard

### Medium Priority
5. **Discovery Call Prep Card** — Tampilkan `DISCOVERY_PREP_BY_CHALLENGE` di result page (data sudah ada di remote tapi belum ditampilkan)
6. **Email Capture** — Opsi kirim result via email (bukan hanya WhatsApp)
7. **Social Proof** — Testimonial/review cards di result page

### Low Priority
8. **Admin Dashboard** — Lihat semua session yang masuk (`/admin` sudah ada tapi minimal)
9. **Analytics** — Track conversion rate per step
10. **Multi-language** — English version

## Aturan Penting
- **JANGAN** gunakan PAT/token yang diberikan user di chat (keamanan)
- **JANGAN** commit `node_modules`, `.env.local`, atau file sensitive
- **Selalu** build (`npx next build`) sebelum commit/push
- **Minimal changes** — ubah hanya yang perlu, jangan over-engineering
- **Pertahankan** backward compatibility ke database/API

## Troubleshooting Umum
- **Build error:** cek `npx next build`, biasanya type error atau import salah
- **Merge conflict:** kalau ada conflict di `PesatExperience.tsx`, ambil versi remote sebagai base lalu apply quality questions + result upgrade
- **Deploy gagal:** cek GitHub Actions → biasanya quality gate atau secret missing
- **DB error:** cek `DATABASE_URL` di env / wrangler secret

## Kontak & Resources
- Cloudflare Account: `n311311@gmail.com`
- Cloudflare Account ID: `99dd60debc042e9b615dd44472645e71`
- Deploy script: `scripts/finalize-cloudflare.ps1`
- Check script: `scripts/check-production.ps1`
