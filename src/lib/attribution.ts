/** Provenienza della prima visita e contesto del dispositivo (senza dati identificativi). */

const firstTouchKey = "factanza-first-touch";
const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export type FirstTouch = Record<string, string>;

/** Da chiamare al primo caricamento: salva sito di provenienza e parametri utm_*. */
export function captureFirstTouch() {
  try {
    if (localStorage.getItem(firstTouchKey)) return;
    const params = new URLSearchParams(window.location.search);
    const touch: FirstTouch = { landing: window.location.pathname.slice(0, 80) };
    for (const key of utmKeys) {
      const value = params.get(key);
      if (value) touch[key] = value.slice(0, 80);
    }
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) touch["referrer"] = host.slice(0, 80);
    }
    localStorage.setItem(firstTouchKey, JSON.stringify(touch));
  } catch {
    // storage non disponibile: nessuna provenienza
  }
}

export function firstTouch(): FirstTouch {
  try {
    const saved = localStorage.getItem(firstTouchKey);
    return saved ? (JSON.parse(saved) as FirstTouch) : {};
  } catch {
    return {};
  }
}

/** Famiglie generiche di sistema e browser (mai la stringa completa dello user agent). */
export function parseUserAgent(ua: string) {
  const os = /iphone|ipad|ipod/i.test(ua)
    ? "iOS"
    : /android/i.test(ua)
      ? "Android"
      : /windows/i.test(ua)
        ? "Windows"
        : /mac os x|macintosh/i.test(ua)
          ? "macOS"
          : /linux/i.test(ua)
            ? "Linux"
            : "Altro";
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /instagram/i.test(ua)
      ? "Instagram"
      : /fban|fbav/i.test(ua)
        ? "Facebook"
        : /tiktok|bytedance/i.test(ua)
          ? "TikTok"
          : /samsungbrowser/i.test(ua)
            ? "Samsung Internet"
            : /firefox|fxios/i.test(ua)
              ? "Firefox"
              : /chrome|crios/i.test(ua)
                ? "Chrome"
                : /safari/i.test(ua)
                  ? "Safari"
                  : "Altro";
  return { os, browser };
}

export function deviceType(width: number, ua: string) {
  if (/ipad|tablet/i.test(ua) || (width >= 600 && width < 1024 && /android/i.test(ua)))
    return "tablet";
  if (width < 768 || /mobi|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

/** Contesto della visita per l'evento `session_start`. */
export function visitContext(): Record<string, string | number | boolean> {
  const ua = navigator.userAgent;
  const { os, browser } = parseUserAgent(ua);
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
    .connection;
  return {
    device: deviceType(window.innerWidth, ua),
    os,
    browser,
    screen_w: window.screen.width,
    screen_h: window.screen.height,
    viewport_w: window.innerWidth,
    language: navigator.language.slice(0, 10),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone.slice(0, 40),
    dark_mode: window.matchMedia("(prefers-color-scheme: dark)").matches,
    reduced_motion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    standalone: window.matchMedia("(display-mode: standalone)").matches,
    connection: connection?.effectiveType ?? "sconosciuta",
    ...firstTouch(),
  };
}
