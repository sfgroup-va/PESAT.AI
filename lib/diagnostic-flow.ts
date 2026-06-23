// Data-driven conversation script for the AI Business Coach Mini Session (v2).
//
// Mental model: bukan "isi pertanyaan → keluar report", tapi
// "AI berhipotesis → user koreksi/konfirmasi → AI makin tajam → insight real-time".
//
// Setiap node memakai pola observasi → dugaan → konfirmasi.
// Setelah user memilih, AI memberi `reaction` (momen "iya juga ya") SEBELUM next node.
// Insight terakumulasi di panel persistent lewat `insightSlot` + `insightValue`.

import type { PartialDiagnosticState } from "./diagnostic-state";

export type InsightSlotId = "pressure" | "rootCause" | "bottleneck" | "solution";

export type QuickReply = {
  id: string;
  label: string;
  emoji?: string;
  nextNode: FlowNodeId;
  update: PartialDiagnosticState;
  /** Reaksi AI yang muncul setelah user memilih — momen "iya juga ya". */
  reaction?: string;
  /** Slot insight yang akan terisi + label isian. Keduanya wajib bersama. */
  insightSlot?: InsightSlotId;
  insightValue?: string;
  freeText?: boolean;
  freeTextPlaceholder?: string;
  /** Untuk opsi "Lainnya": reaction tetap dimainkan, insight pakai slot generik. */
  insightLabel?: string;
};

export type CoachMessage = {
  text: string;
  delayMs?: number;
  typewriter?: boolean;
};

/**
 * Pesan yang dirakit dinamis dari diagnostic state — dipakai untuk
 * rangkuman Round 4 ("Kalau saya rangkum...") supaya terasa benar-benar
 * membaca user, bukan template statis.
 */
export type DynamicMessageFn = (state: PartialDiagnosticState) => string;

export type FlowNode = {
  id: FlowNodeId;
  messages: CoachMessage[];
  /** Pesan dinamis yang dirakit dari state (mis. rangkuman). */
  dynamicMessages?: DynamicMessageFn[];
  quickReplies?: QuickReply[];
  statusLabel?: string;
};

export type FlowNodeId =
  | "welcome"
  | "pressure-reading"
  | "root-cause"
  | "bottleneck-test"
  | "solution-direction"
  | "transition-to-result";

// Helper text untuk merangkum jawaban user di Round 4.
const PRESSURE_SUMMARY: Record<string, string> = {
  cost_pressure: "biaya terus jalan tanpa hasil sepadan",
  risk_trust_pressure: "terlalu banyak hal bergantung ke Anda",
  cash_stock_pressure: "masalah baru terlihat saat sudah telat"
};

const ROOTCAUSE_SUMMARY: Record<string, string> = {
  repeated_work: "kerja kecil yang terus berulang",
  owner_bottleneck: "keputusan kecil yang menumpuk di owner",
  late_visibility: "masalah yang baru terlihat saat telat",
  mixed: "kebocoran kecil yang numpuk dari banyak sisi"
};

const BOTTLENECK_SUMMARY: Record<string, string> = {
  manual_admin: "input & cek ulang data manual",
  approval_pileup: "antrean keputusan",
  data_scattered: "data tersebar di banyak tempat",
  knowledge_silo: "pengetahuan yang cuma dipegang 1–2 orang"
};

function rangkumanMessage(state: PartialDiagnosticState): string {
  const pressure = state.pressureSource ? PRESSURE_SUMMARY[state.pressureSource] : null;
  const root = state.rootCause ? ROOTCAUSE_SUMMARY[state.rootCause] : null;
  const bottleneck = state.bottleneck ? BOTTLENECK_SUMMARY[state.bottleneck] : null;

  const parts: string[] = [];
  if (pressure) parts.push(`Tekanan utamanya bukan di permintaan, tapi di ${pressure}`);
  if (root) parts.push(`akarnya di ${root}`);
  if (bottleneck) parts.push(`titik macetnya di ${bottleneck}`);

  if (parts.length === 0) {
    return "Kalau saya rangkum sejauh ini, pola bisnis Anda sudah mulai jelas.";
  }
  // Gabungkan: "A, B, dan C."
  if (parts.length === 1) return parts[0] + ".";
  const last = parts[parts.length - 1];
  return parts.slice(0, -1).join(", ") + ", dan " + last + ".";
}

export const COACH_FLOW: Record<FlowNodeId, FlowNode> = {
  welcome: {
    id: "welcome",
    messages: [
      {
        text: "Saya bantu cari titik hemat paling realistis untuk bisnis Anda.",
        delayMs: 600,
        typewriter: true
      },
      {
        text: "Nanti Anda tinggal koreksi kalau saya meleset — saya mulai dari mengenali tekanan besarnya dulu, lalu kita persempit bersama.",
        delayMs: 1200,
        typewriter: true
      }
    ],
    quickReplies: [
      {
        id: "next",
        label: "Mulai diagnosa",
        emoji: "👋",
        nextNode: "pressure-reading",
        update: {}
      }
    ],
    statusLabel: "Memulai sesi diagnostik"
  },

  "pressure-reading": {
    id: "pressure-reading",
    messages: [
      {
        text: "Di kondisi seperti sekarang, bisnis biasanya tidak goyah karena satu keputusan besar. Tekanannya datang dari kebocoran kecil yang menumpuk diam-diam.",
        delayMs: 800,
        typewriter: true
      },
      {
        text: "Dari empat pola ini, mana yang paling dekat dengan yang Anda rasakan?",
        delayMs: 800,
        typewriter: true
      }
    ],
    quickReplies: [
      {
        id: "cost_pressure",
        label: "Uang keluar terus, tapi saya tidak merasa lebih ringan",
        emoji: "💸",
        nextNode: "root-cause",
        update: { pressureSource: "cost_pressure", severity: "moderate" },
        reaction: "Oke. Berarti tekanannya bukan di permintaan yang hilang, tapi di biaya yang terus jalan tanpa hasil sepadan. Saya curiga masalahnya di operasional.",
        insightSlot: "pressure",
        insightValue: "biaya operasional yang berulang"
      },
      {
        id: "effort_pressure",
        label: "Tim terlihat sibuk, tapi hasilnya stagnan",
        emoji: "🏃",
        nextNode: "root-cause",
        update: { pressureSource: "cost_pressure", severity: "moderate" },
        reaction: "Oke. Kalau tim sudah sibuk tapi hasilnya belum berubah, saya belum curiga pada jumlah orang. Saya lebih curiga pada cara kerjanya — energi terkuras di tempat yang salah.",
        insightSlot: "pressure",
        insightValue: "cara kerja yang menghabiskan energi tim"
      },
      {
        id: "owner_pressure",
        label: "Kalau saya lepas, saya takut ada yang terlewat",
        emoji: "👤",
        nextNode: "root-cause",
        update: { pressureSource: "risk_trust_pressure", severity: "serious" },
        reaction: "Kena. Berarti bisnis masih bergantung ke keterlibatan Anda. Itu biasanya sinyal keputusan kecil belum punya sistem, jadi semuanya naik ke Anda.",
        insightSlot: "pressure",
        insightValue: "ketergantungan ke owner"
      },
      {
        id: "visibility_pressure",
        label: "Masalah sering baru terlihat setelah terlambat",
        emoji: "⏰",
        nextNode: "root-cause",
        update: { pressureSource: "cash_stock_pressure", severity: "serious" },
        reaction: "Kena. Berarti Anda sering bereaksi terlambat — bukan karena tidak peduli, tapi karena informasi datang setelah kerugiannya terjadi.",
        insightSlot: "pressure",
        insightValue: "visibilitas yang terlambat"
      },
      {
        id: "pressure_other",
        label: "Lainnya",
        emoji: "✏️",
        nextNode: "root-cause",
        update: {},
        reaction: "Oke, terima kasih detailnya. Saya catat ini sebagai konteks tambahan.",
        insightSlot: "pressure",
        insightValue: "tekanan spesifik dari bisnis Anda",
        freeText: true,
        freeTextPlaceholder: "Ceritakan kondisi bisnis Anda saat ini"
      }
    ],
    statusLabel: "Mengenali tekanan bisnis"
  },

  "root-cause": {
    id: "root-cause",
    messages: [
      {
        text: "Saya persempit satu tingkat lagi. Biasanya kalau seperti ini, akar masalahnya bukan satu hal besar — tapi salah satu dari pola berikut. Mana yang paling menguras energi Anda?",
        delayMs: 1000,
        typewriter: true
      }
    ],
    quickReplies: [
      {
        id: "repeated_work",
        label: "Kerja kecil yang berulang",
        emoji: "🔄",
        nextNode: "bottleneck-test",
        update: { rootCause: "repeated_work" },
        reaction: "Menarik. Kerja berulang adalah biaya yang paling tidak terlihat di laporan — tapi paling nyata di energi tim.",
        insightSlot: "rootCause",
        insightValue: "kerja berulang yang terus jalan"
      },
      {
        id: "owner_bottleneck",
        label: "Keputusan kecil selalu ke saya",
        emoji: "🚧",
        nextNode: "bottleneck-test",
        update: { rootCause: "owner_bottleneck" },
        reaction: "Kena. Kalau keputusan kecil terus berhenti di Anda, biaya termahal sebenarnya bukan gaji — tapi lambatnya seluruh alur bisnis.",
        insightSlot: "rootCause",
        insightValue: "keputusan menumpuk di owner"
      },
      {
        id: "late_visibility",
        label: "Masalah baru terlihat saat sudah terlambat",
        emoji: "⏰",
        nextNode: "bottleneck-test",
        update: { rootCause: "late_visibility" },
        reaction: "Kena. Visibilitas yang terlambat berarti Anda mengambil keputusan hari ini dengan data kemarin.",
        insightSlot: "rootCause",
        insightValue: "masalah telat terlihat"
      },
      {
        id: "mixed",
        label: "Campuran dari semuanya",
        emoji: "🌀",
        nextNode: "bottleneck-test",
        update: { rootCause: "mixed" },
        reaction: "Oke, campuran. Itu wajar. Nanti saya susun prioritasnya — mana yang kalau diselesaikan dulu, sisanya ikut ringan.",
        insightSlot: "rootCause",
        insightValue: "kebocoran dari banyak sisi"
      },
      {
        id: "root_cause_other",
        label: "Lainnya",
        emoji: "✏️",
        nextNode: "bottleneck-test",
        update: {},
        reaction: "Oke, saya catat. Kadang akar masalah yang sebenarnya bukan yang ada di daftar standar.",
        insightSlot: "rootCause",
        insightValue: "akar masalah spesifik Anda",
        freeText: true,
        freeTextPlaceholder: "Apa yang paling menguras energi Anda?"
      }
    ],
    statusLabel: "Mempersempit akar masalah"
  },

  "bottleneck-test": {
    id: "bottleneck-test",
    messages: [
      {
        text: "Satu hal lagi agar saya yakin. Ketika hal-hal kecil macet di bisnis Anda, biasanya berhenti di mana?",
        delayMs: 1000,
        typewriter: true
      }
    ],
    quickReplies: [
      {
        id: "manual_admin",
        label: "Input & cek ulang data manual",
        emoji: "📝",
        nextNode: "solution-direction",
        update: { bottleneck: "manual_admin" },
        reaction: "Nah, itu. Input manual adalah pekerjaan yang sebenarnya bisa dijalankan sistem — tapi sekarang dikerjakan manusia, berulang, setiap hari.",
        insightSlot: "bottleneck",
        insightValue: "input manual berulang"
      },
      {
        id: "approval_pileup",
        label: "Menunggu keputusan saya / atasan",
        emoji: "⏳",
        nextNode: "solution-direction",
        update: { bottleneck: "approval_pileup" },
        reaction: "Kena. Antrean keputusan itu penghalang paling halus — semua orang nunggu, momentum hilang.",
        insightSlot: "bottleneck",
        insightValue: "antrean keputusan"
      },
      {
        id: "data_scattered",
        label: "Data tersebar di banyak tempat",
        emoji: "📊",
        nextNode: "solution-direction",
        update: { bottleneck: "data_scattered" },
        reaction: "Kena. Data tersebar artinya setiap keputusan butuh mengumpulkan data dulu — dan sering versinya berbeda-beda.",
        insightSlot: "bottleneck",
        insightValue: "data tersebar"
      },
      {
        id: "knowledge_silo",
        label: "Cuma 1–2 orang yang tahu caranya",
        emoji: "🧠",
        nextNode: "solution-direction",
        update: { bottleneck: "knowledge_silo" },
        reaction: "Kena. Kalau hanya 1–2 orang yang tahu, satu orang cuti atau resign saja proses bisa berhenti. Itu risiko tersembunyi.",
        insightSlot: "bottleneck",
        insightValue: "pengetahuan terkonsentrasi di sedikit orang"
      },
      {
        id: "bottleneck_other",
        label: "Lainnya",
        emoji: "✏️",
        nextNode: "solution-direction",
        update: {},
        reaction: "Oke, terima kasih. Saya catat titik macet spesifik Anda.",
        insightSlot: "bottleneck",
        insightValue: "titik macet spesifik Anda",
        freeText: true,
        freeTextPlaceholder: "Di mana proses biasanya berhenti?"
      }
    ],
    statusLabel: "Menguji titik macet (bottleneck)"
  },

  "solution-direction": {
    id: "solution-direction",
    // Pesan pertama dirakit dinamis dari jawaban user — momen "wow" coach membaca.
    dynamicMessages: [rangkumanMessage],
    messages: [
      {
        text: "Kabar baiknya — Anda tidak butuh sistem besar dulu. Anda butuh quick win yang membuat bisnis terasa lebih ringan, lebih terlihat, dan tidak terlalu bergantung pada energi Anda sendiri.",
        delayMs: 1200,
        typewriter: true
      },
      {
        text: "Sebelum saya susun insight-nya, arah mana yang paling cocok untuk Anda?",
        delayMs: 700,
        typewriter: true
      }
    ],
    quickReplies: [
      {
        id: "quick_win",
        label: "Iya, quick win dulu saja",
        emoji: "⚡",
        nextNode: "transition-to-result",
        update: { solutionStyle: "quick_win" },
        reaction: "Pas. Kita ambil satu titik yang kalau diselesaikan, efeknya langsung terasa. Itu cara terbaik membangun momentum.",
        insightSlot: "solution",
        insightValue: "quick win dulu, bukan proyek besar"
      },
      {
        id: "full_setup",
        label: "Saya ingin yang lebih agresif",
        emoji: "🚀",
        nextNode: "transition-to-result",
        update: { solutionStyle: "full_setup" },
        reaction: "Oke, Anda siap sesuatu yang lebih menyeluruh. Nanti saya susun urutannya — tetap mulai dari yang berdampak tercepat, lalu perluas.",
        insightSlot: "solution",
        insightValue: "setup menyeluruh, bertahap"
      },
      {
        id: "pilot",
        label: "Belum yakin, coba pilot kecil dulu",
        emoji: "🧪",
        nextNode: "transition-to-result",
        update: { solutionStyle: "pilot" },
        reaction: "Pilihan paling bijak. Pilot kecil yang terukur lebih meyakinkan daripada proyek besar yang ambigu.",
        insightSlot: "solution",
        insightValue: "pilot terukur dulu"
      },
      {
        id: "solution_other",
        label: "Lainnya",
        emoji: "✏️",
        nextNode: "transition-to-result",
        update: {},
        reaction: "Oke, saya catat harapan spesifik Anda. Ini jadi acuan arah solusi yang paling pas.",
        insightSlot: "solution",
        insightValue: "arah solusi spesifik Anda",
        freeText: true,
        freeTextPlaceholder: "Apa yang Anda harapkan dari solusi ini?"
      }
    ],
    statusLabel: "Menyusun arah solusi"
  },

  "transition-to-result": {
    id: "transition-to-result",
    messages: [
      {
        text: "Oke, saya sudah cukup paham polanya. Saya rangkum jadi insight yang bisa langsung Anda baca.",
        delayMs: 1000,
        typewriter: true
      }
    ],
    statusLabel: "Menyusun hasil diagnosis"
  }
};

export const START_NODE: FlowNodeId = "welcome";

/**
 * Slot insight yang terisi sepanjang sesi. Urutan ini juga jadi urutan
 * tampil di InsightAccumulator panel.
 */
export const INSIGHT_SLOTS: Array<{ id: InsightSlotId; label: string }> = [
  { id: "pressure", label: "Titik tekanan" },
  { id: "rootCause", label: "Akar masalah" },
  { id: "bottleneck", label: "Bottleneck" },
  { id: "solution", label: "Arah solusi" }
];
