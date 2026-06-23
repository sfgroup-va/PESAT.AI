"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type CoachContextValue = {
  /** Panel coach sedang terbuka (overlay aktif). */
  isOpen: boolean;
  /** User pernah membuka coach minimal sekali (untuk menyembunyikan attention pulse). */
  hasInteracted: boolean;
  /** Counter untuk force-remount CoachContainer saat reopen (reset sesi). */
  sessionKey: number;
  /** Buka panel coach sebagai overlay. */
  openCoach: () => void;
  /** Tutup panel coach (kembali ke launcher bubble). */
  closeCoach: () => void;
};

const CoachContext = createContext<CoachContextValue | null>(null);

export function CoachProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);

  const openCoach = useCallback(() => {
    setSessionKey((k) => k + 1);
    setHasInteracted(true);
    setIsOpen(true);
  }, []);

  const closeCoach = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, hasInteracted, sessionKey, openCoach, closeCoach }),
    [isOpen, hasInteracted, sessionKey, openCoach, closeCoach]
  );

  return <CoachContext.Provider value={value}>{children}</CoachContext.Provider>;
}

export function useCoach(): CoachContextValue {
  const ctx = useContext(CoachContext);
  if (!ctx) throw new Error("useCoach must be used within <CoachProvider>");
  return ctx;
}
