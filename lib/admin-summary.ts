export const FUNNEL_ORDER = ["s1", "fact1", "s2", "fact2", "s3", "s4", "s5", "s6", "s7", "s8"] as const;

type AdminSessionRow = {
  completed: boolean | null;
  discovery_requested: boolean | null;
};

type AdminEventRow = {
  screen: string | null;
  type: string | null;
  metadata: unknown;
};

type AdminDiscoveryRow = {
  id: string;
};

export type AdminSummary = ReturnType<typeof buildAdminSummary>;

export function buildAdminSummary(sessions: AdminSessionRow[] = [], events: AdminEventRow[] = [], discovery: AdminDiscoveryRow[] = []) {
  const screenViewEvents = events.filter((event) => event.type === "screen_view");
  const clickEvents = events.filter((event) => event.type === "click");

  const funnel = screenViewEvents.reduce<Record<string, number>>((acc, event) => {
    const screen = event.screen || "unknown";
    acc[screen] = (acc[screen] || 0) + 1;
    return acc;
  }, {});

  const clickCounts = clickEvents.reduce<Record<string, number>>((acc, event) => {
    const metadata = event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata) ? event.metadata : {};
    const cta = "cta" in metadata && typeof metadata.cta === "string" && metadata.cta.trim() ? metadata.cta.trim() : event.screen || "unknown";
    acc[cta] = (acc[cta] || 0) + 1;
    return acc;
  }, {});

  const orderedFunnel = FUNNEL_ORDER.map((screen) => ({ screen, count: funnel[screen] || 0 }));
  const dropOff = orderedFunnel.map((row, index) => {
    const previous = index === 0 ? row.count : orderedFunnel[index - 1].count;
    const lost = Math.max(0, previous - row.count);
    const conversionRate = previous > 0 ? Math.round((row.count / previous) * 1000) / 10 : 0;
    const dropOffRate = previous > 0 ? Math.round((lost / previous) * 1000) / 10 : 0;

    return {
      screen: row.screen,
      count: row.count,
      previous,
      lost,
      conversionRate,
      dropOffRate
    };
  });

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((session) => session.completed).length;
  const discoveryRequestedSessions = sessions.filter((session) => session.discovery_requested).length;
  const discoveryRequestCount = discovery.length;

  return {
    sessions: {
      total: totalSessions,
      completed: completedSessions,
      discoveryRequested: discoveryRequestedSessions
    },
    discoveryRequests: discoveryRequestCount,
    rates: {
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 1000) / 10 : 0,
      discoveryRate: completedSessions > 0 ? Math.round((discoveryRequestCount / completedSessions) * 1000) / 10 : 0
    },
    clicks: {
      total: clickEvents.length,
      byCta: Object.entries(clickCounts)
        .map(([cta, count]) => ({ cta, count }))
        .sort((a, b) => b.count - a.count || a.cta.localeCompare(b.cta))
    },
    funnel: orderedFunnel,
    dropOff
  };
}
