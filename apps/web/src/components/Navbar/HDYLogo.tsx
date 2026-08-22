import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandLogo, HexBadge, trackNavigationEvent } from "@build-me/ui/navbar";

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
      className="hover:bg-blue-500! focus:bg-blue-500!/10 active:bg-blue-500!/20 flex items-center gap-2 rounded-md px-2 py-1 text-blue-50 transition-colors duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900 active:text-blue-100"
      as={Link}
      href="/"
      ariaLabel="Home"
      onLogoClick={(event) => {
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
