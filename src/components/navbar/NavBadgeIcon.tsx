import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";

interface NavBadgeIconProps {
  href: string;
  count: number;
  icon: React.ReactNode;
  hoverClass?: string;
  isCart?: boolean;
}

export const NavBadgeIcon = ({
  href,
  count,
  icon,
  hoverClass,
  isCart,
}: NavBadgeIconProps) => (
  <Link href={href}>
    <Button
      variant="ghost"
      size="icon"
      className={`relative h-11 w-11 rounded-xl transition-all ${isCart ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white" : hoverClass}`}
    >
      {icon}
      {count > 0 && (
        <Badge
          className={`absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center border-2 border-background ${isCart ? "bg-indigo-600 text-white" : "bg-indigo-500"}`}
        >
          {count}
        </Badge>
      )}
    </Button>
  </Link>
);
