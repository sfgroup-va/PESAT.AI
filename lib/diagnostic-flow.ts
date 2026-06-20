// Data-driven conversation script for the AI Business Coach Mini Session.
// Each node = one "turn" in the diagnostic conversation.

import type { PartialDiagnosticState } from "./diagnostic-state";

export type QuickReply = {
  id: string;
  label: string;
  emoji?: string;
  nextNode: FlowNodeId;
  update: PartialDiagnosticState;
};

export type CoachMessage = {
  text: string;
  delayMs?: number;
  typewriter?: boolean;
};

export type FlowNode = {
  id: FlowNodeId;
  messages: CoachMessage[];
  quickReplies?: QuickReply[];
  insights?: string[];
  statusLabel?: string;
};

export type FlowNodeId =
  | "welcome"
  | "pressure-reading"
  | "root-cause"
  | "bottleneck-test"
  | "solution-direction"
  | "transition-to-result";

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
        text: "Biasanya di kondisi pasar seperti ini, masalahnya bukan sekadar omzet turun — tapi biaya kecil terus bocor, owner makin sering turun tangan, dan tim sibuk tanpa hasil yang sepadan.",
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
    statusLabel: "Membaca pola bisnis Anda"
  },

  "pressure-reading": {
    id: "pressure-reading",
    messages: [
      {
        text: "Saya mau cek, yang paling dekat dengan kondisi Anda saat ini yang mana?",
        delayMs: 800,
        typewriter: true
      }
    ],
    quickReplies: [
      {
        id: "cost_pressure",
        label: "Biaya terus jalan, tapi hasilnya tidak terasa",
        nextNode: "root-cause",
        update: { pressureSource: "cost_pressure", severity: "moderate" }
      },
      {
        id: "effort_pressure",
        label: "Tim sibuk, tapi output tidak sebanding",
        nextNode: "root-cause",
        update: { pressureSource: "cost_pressure", severity: "moderate" }
      },
      {
        id: "owner_pressure",
        label: "Saya harus ikut terlalu banyak hal",
        nextNode: "root-cause",
        update: { pressureSource: "risk_trust_pressure", severity: "serious" }
      },
      {
        id: "visibility_pressure",
        label: "Masalah baru kelihatan saat telat",
        nextNode: "root-cause",
        update: { pressureSource: "cash_stock_pressure", severity: "serious" }
      }
    ],
    statusLabel: "Hipotesis 1 dari 4",
    insights: ["Tekanan terbesar tampaknya ada di sisi operasional, bukan demand"]
  },

  "root-cause": {
    id: "root-cause",
    messages: [
      {
        text: "Oke. Saya curiga problem Anda bukan di biaya besar yang kelihatan, tapi di kerja kecil yang berulang, keputusan yang naik terus ke owner, atau masalah yang baru kelihatan saat sudah telat.",
        delayMs: 1200,
        typewriter: true
      },
      {
        text: "Dari tiga ini, mana yang paling menguras energi Anda?",
        delayMs: 800,
        typewriter: true
      }
    ],
    quickReplies: [
      {
        id: "repeated_work",
        label: "Kerja kecil berulang",
        nextNode: "bottleneck-test",
        update: { rootCause: "repeated_work" }
      },
      {
        id: "owner_bottleneck",
        label: "Keputusan naik terus ke saya",
        nextNode: "bottleneck-test",
        update: { rootCause: "owner_bottleneck" }
      },
      {
        id: "late_visibility",
        label: "Masalah telat terlihat",
        nextNode: "bottleneck-test",
        update: { rootCause: "late_visibility" }
      },
      {
        id: "mixed",
        label: "Campuran semuanya",
        nextNode: "bottleneck-test",
        update: { rootCause: "mixed" }
      }
    ],
    statusLabel: "Hipotesis 2 dari 4",
    insights: ["Titik bocor utama kemungkinan bukan di 1 pos besar, tapi di pola operasional"]
  },

  "bottleneck-test": {
    id: "bottleneck-test",
    messages: [
      {
        text: "Menarik. Kalau seperti itu, saya mau persempit satu hal lagi: saat hal-hal kecil macet, di mana biasanya proses berhenti?",
        delayMs: 1200,
        typewriter: true
      }
    ],
    quickReplies: [
      {
        id: "manual_admin",
        label: "Input & cek ulang data manual",
        nextNode: "solution-direction",
        update: { bottleneck: "manual_admin" }
      },
      {
        id: "approval_pileup",
        label: "Menunggu keputusan saya atau atasan",
        nextNode: "solution-direction",
        update: { bottleneck: "approval_pileup" }
      },
      {
        id: "data_scattered",
        label: "Data tersebar di banyak tempat",
        nextNode: "solution-direction",
        update: { bottleneck: "data_scattered" }
      },
      {
        id: "knowledge_silo",
        label: "Cuma 1–2 orang yang tahu caranya",
        nextNode: "solution-direction",
        update: { bottleneck: "knowledge_silo" }
      }
    ],
    statusLabel: "Hipotesis 3 dari 4",
    insights: ["Bottleneck tampaknya ada di alur kerja, bukan di jumlah orang"]
  },

  "solution-direction": {
    id: "solution-direction",
    messages: [
      {
        text: "Kalau saya rangkum, sepertinya Anda tidak butuh sistem besar dulu. Anda butuh quick win yang bikin bisnis terasa lebih ringan, lebih terlihat, dan tidak terlalu bergantung pada energi pribadi owner.",
        delayMs: 1400,
        typewriter: true
      },
      {
        text: "Apakah ini sesuai yang Anda cari?",
        delayMs: 600,
        typewriter: true
      }
    ],
    quickReplies: [
      {
        id: "quick_win",
        label: "Iya, itu yang saya cari",
        nextNode: "transition-to-result",
        update: { solutionStyle: "quick_win" }
      },
      {
        id: "full_setup",
        label: "Saya butuh yang lebih agresif",
        nextNode: "transition-to-result",
        update: { solutionStyle: "full_setup" }
      },
      {
        id: "pilot",
        label: "Saya masih belum yakin, mau coba pilot dulu",
        nextNode: "transition-to-result",
        update: { solutionStyle: "pilot" }
      }
    ],
    statusLabel: "Hipotesis 4 dari 4",
    insights: ["Arah solusi: quick win dulu, bukan proyek besar"]
  },

  "transition-to-result": {
    id: "transition-to-result",
    messages: [
      {
        text: "Oke, saya sudah cukup paham polanya. Saya susun insight-nya sebentar.",
        delayMs: 1000,
        typewriter: true
      }
    ],
    statusLabel: "Menyusun hasil diagnosis"
  }
};

export const START_NODE: FlowNodeId = "welcome";
