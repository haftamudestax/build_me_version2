import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandLogo, HexBadge, trackNavigationEvent } from "@build-me/ui/navbar";

/** The HDY monogram + arrow, clipped inside the generic HexBadge. */
function HdyMarkContent() {
  return (
    <>
      <rect x="18" y="23" width="7" height="22" fill="white" />
      <rect x="33" y="23" width="7" height="22" fill="white" />
      <rect x="18" y="31" width="22" height="6" fill="white" />
      <path d="M31 22L24 35H28L25 48L36 32H31L31 22Z" fill="#F7B733" />
    </>
  );
}

/** The corner bracket accents, drawn outside the hex clip. */
function HdyMarkDecorations() {
  return (
    <>
      <path
        d="M27 14L24 17L27 20"
        stroke="#F7B733"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31 14L34 17L31 20"
        stroke="#F7B733"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

export function HDYLogo() {
  const location = useLocation();

  // Fire a logo_view event once per distinct route/mount. Regression
  // note: this was accidentally dropped during the "remove tagline"
  // rewrite — restored here.
  const lastTrackedRouteRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastTrackedRouteRef.current === location.pathname) return;
    lastTrackedRouteRef.current = location.pathname;

    trackNavigationEvent({
      sourceRoute: location.pathname,
      destinationRoute: "/",
      eventType: "logo_view",
      navigationSuccess: true,
    });
  }, [location.pathname]);

  return (
    <BrandLogo
      as={Link}
      href="/"
      ariaLabel="Home"
      onLogoClick={(event) => {
        // Full page reload/redirect to Home — not a client-side SPA
        // scroll. Respect modifier keys / non-primary clicks so
        // ctrl/cmd-click still opens "/" in a new tab natively via href.
        const isPlainLeftClick =
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey;

        trackNavigationEvent({
          sourceRoute: location.pathname,
          destinationRoute: "/",
          eventType: "logo_click",
          navigationSuccess: true,
        });

        if (isPlainLeftClick) {
          event.preventDefault();
          // trackNavigationEvent's fetch uses keepalive: true, so the
          // request above survives this full navigation instead of being
          // cancelled mid-flight.
          window.location.href = "/";
        }
      }}
      mark={
        <HexBadge
          size={58}
          outerColor="white"
          midColor="#F7B733"
          innerColor="#0B1740"
          decorations={<HdyMarkDecorations />}
        >
          <HdyMarkContent />
        </HexBadge>
      }
      wordmark={
        <span className="text-base font-semibold tracking-tight text-blue-50 sm:text-lg">
          Haftamu Desta
        </span>
      }
    />
  );
}
