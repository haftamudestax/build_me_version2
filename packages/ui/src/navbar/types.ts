import type { ComponentType, MouseEvent, ReactNode } from "react";

export interface RouterLinkProps {
  to: string;
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
  "aria-current"?: "page";
  onClick?: (event: MouseEvent) => void;
}
export type RouterLinkComponent = ComponentType<RouterLinkProps>;
export interface RouterNavLinkProps {
  to: string;
  end?: boolean;
  className?: (state: { isActive: boolean }) => string;
  children?: ReactNode;
}
export type RouterNavLinkComponent = ComponentType<RouterNavLinkProps>;

export interface NavItem {
  label: string;
  to: string;
  end?: boolean;
}
