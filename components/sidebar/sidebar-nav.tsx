"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  BadgeDollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  dashboard: LayoutDashboard,
  package: Package,
  users: Users,
  settings: Settings,
  badgeDollarSign: BadgeDollarSign,
};

export type NavItem = {
  title: string;
  href: string;
  icon: keyof typeof iconMap;
};

type SidebarNavProps = {
  items: NavItem[];
};

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = iconMap[item.icon];

        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium leading-5 transition-all",
              isActive
                ? "bg-[#F3F4F3] text-foreground "
                : "text-foreground/70 hover:bg-[#F7F7F7] hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
