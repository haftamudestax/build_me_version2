import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandLogo, HexBadge, trackNavigationEvent } from "@build-me/ui/navbar";

const Y_GRADIENT_ID = "hdy-logo-y-gradient";

/** The HDY-specific monogram + arrow, clipped inside the generic HexBadge. */
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

/** The "HD" + gradient "Y" wordmark lockup. */
function HdyWordmark() {
  return (
    <>
      <span className="text-4xl font-extrabold tracking-[-0.06em] text-sky-400">
        HD
      </span>
      <svg
        width="46"
        height="30"
        viewBox="0 0 150 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="-ml-0.5 shrink-0"
      >
        <defs>
          <linearGradient id={Y_GRADIENT_ID} x1="0" y1="0" x2="0" y2="96">
            <stop offset="0%" stopColor="#2C5DDE" />
            <stop offset="100%" stopColor="#12336F" />
          </linearGradient>
        </defs>
        <path
          d="M0 0L42 83L42 96L88 96L88 83L150 0L90 0L68 43L40 0Z"
          fill={`url(#${Y_GRADIENT_ID})`}
        />
        <path d="M91 1L150 0L120 37L91 37Z" fill="#F7B733" />
      </svg>
    </>
  );
}

export function HDYLogo() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Fire a logo_view event once per distinct route — the navbar is
  // sticky/always-visible on render, so "mounted for this route" is an
  // accurate proxy for "viewed" without needing an IntersectionObserver.
  // The ref guards against React 18 StrictMode's dev-only double-invoke
  // firing this twice for the same route.
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
        if (isHome) event.preventDefault();

        trackNavigationEvent({
          sourceRoute: location.pathname,
          destinationRoute: "/",
          eventType: "logo_click",
          navigationSuccess: true,
        });
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
      wordmark={<HdyWordmark />}
      taglineLines={[
        <span
          key="role-1"
          className="text-[10px] font-semibold tracking-[0.16em] leading-none text-blue-100"
        >
          FULL STACK DEVELOPER
        </span>,
        <span
          key="and"
          aria-hidden="true"
          className="text-[8px] font-medium italic leading-none text-blue-300"
        >
          and
        </span>,
        <span
          key="role-2"
          className="text-[10px] font-semibold tracking-[0.16em] leading-none text-blue-100"
        >
          ELECTRICAL ENGINEER
        </span>,
      ]}
    />
  );
}
