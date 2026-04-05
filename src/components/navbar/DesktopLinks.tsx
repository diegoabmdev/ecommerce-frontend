import { NavLink } from "@/types/types";
import { motion } from "framer-motion";
import Link from "next/link";

interface DesktopLinksProps {
  navLinks: NavLink[];
  pathname: string;
}

export const DesktopLinks = ({ navLinks, pathname }: DesktopLinksProps) => (
  <div className="flex items-center gap-1 h-full">
    {navLinks.map((link: NavLink) => (
      <Link
        key={link.href}
        href={link.href}
        className="flex items-center gap-2 px-4 h-full text-sm font-bold transition-all hover:text-indigo-600 relative"
      >
        {link.icon} {link.name}
        {pathname === link.href && (
          <motion.div
            layoutId="nav-underline"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
          />
        )}
      </Link>
    ))}
  </div>
);
