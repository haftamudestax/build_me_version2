import type { MouseEvent, ReactNode } from "react";
import type { RouterLinkComponent } from "./types";

export interface BrandLogoProps {
  as: RouterLinkComponent;
  href: string;
  ariaLabel: string;
  mark: ReactNode;
  wordmark?: ReactNode;
  taglineLines?: ReactNode[];
  className?: string;
  onLogoClick?: (event: MouseEvent) => void;
}

const DEFAULT_CLASS =
  "inline-flex shrink-0 items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900";

export function BrandLogo({
  as: LinkComponent,
  href,
  ariaLabel,
  mark,
  wordmark,
  taglineLines,
  className,
  onLogoClick,
}: BrandLogoProps) {
  return (
    <LinkComponent
      to={href}
      aria-label={ariaLabel}
      className={className ?? DEFAULT_CLASS}
      onClick={onLogoClick}
    >
      {mark}

      {(wordmark || taglineLines?.length) && (
        <span className="flex flex-col">
          {wordmark && (
            <span className="flex h-8 items-center leading-none">
              {wordmark}
            </span>
          )}
          {taglineLines?.length && (
            <span className="flex flex-col h-12 items-start justify-center leading-none mb-2">
              {taglineLines.map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </span>
          )}
        </span>
      )}
    </LinkComponent>
  );
}
