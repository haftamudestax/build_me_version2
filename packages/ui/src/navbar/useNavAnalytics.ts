export type NavEventType = "logo_click" | "nav_link_click" | "logo_view";

export interface NavigationEventPayload {
  session_id: string;
  source_route: string;
  destination_route: string;
  event_type: NavEventType;
  navigation_success: boolean;
  device_type: "desktop" | "tablet" | "mobile";
  viewport_type: string;
}

interface NavAnalyticsConfig {
  baseUrl: string | null;
}

let config: NavAnalyticsConfig = {
  baseUrl: null,
};

export function configureNavAnalytics(
  next: Partial<NavAnalyticsConfig>,
): void {
  config = { ...config, ...next };
}

function getSessionId(): string {
  const key = "nav_session_id";
  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}

function getDeviceType(): NavigationEventPayload["device_type"] {
  const width = window.innerWidth;

  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";

  return "desktop";
}

export function trackNavigationEvent(params: {
  sourceRoute: string;
  destinationRoute: string;
  eventType: NavEventType;
  navigationSuccess: boolean;
}): void {
  if (!config.baseUrl) return;

  const payload: NavigationEventPayload = {
    session_id: getSessionId(),
    source_route: params.sourceRoute,
    destination_route: params.destinationRoute,
    event_type: params.eventType,
    navigation_success: params.navigationSuccess,
    device_type: getDeviceType(),
    viewport_type: `${window.innerWidth}x${window.innerHeight}`,
  };

  void fetch(`${config.baseUrl}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}