import type { ReactNode } from "react";
import type { RouterNavLinkComponent } from "./types";

export interface NavLinkItemProps {
  as: RouterNavLinkComponent;
  to: string;
  end?: boolean;
  children: ReactNode;
  className?: (state: { isActive: boolean }) => string;
}

const defaultClassName = ({ isActive }: { isActive: boolean }) =>
  `relative py-2 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 ${
    isActive ? "text-white" : "text-blue-200 hover:text-white"
  }`;

export function NavLinkItem({
  as: NavLinkComponent,
  to,
  end,
  children,
  className = defaultClassName,
}: NavLinkItemProps) {
  return (
    <NavLinkComponent to={to} end={end} className={className}>
      {children}
    </NavLinkComponent>
  );
}
