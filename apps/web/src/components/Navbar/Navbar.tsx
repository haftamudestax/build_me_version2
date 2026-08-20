import { NavLink } from "react-router-dom";
import {
  Navbar as SharedNavbar,
  NavLinkItem,
  MobileMenu,
} from "@build-me/ui/navbar";
import type { NavItem } from "@build-me/ui/navbar";
import { HDYLogo } from "./HDYLogo";

const NAV_LINKS: NavItem[] = [
  { label: "Home", to: "/", end: true },
  // { label: "Projects", to: "/projects" },
  // { label: "Contact", to: "/contact" },
];

export function Navbar() {
  return (
    <SharedNavbar logo={<HDYLogo />}>
      <div className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <NavLinkItem key={link.to} as={NavLink} to={link.to} end={link.end}>
            {link.label}
          </NavLinkItem>
        ))}
      </div>

      <MobileMenu>
        {NAV_LINKS.map((link) => (
          <NavLinkItem
            key={link.to}
            as={NavLink}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-base font-medium ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-blue-200 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLinkItem>
        ))}
      </MobileMenu>
    </SharedNavbar>
  );
}
