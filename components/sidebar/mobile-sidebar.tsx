"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarContent } from "@/components/sidebar/sidebar-content";

type MobileSidebarProps = {
  groupId: string;
  groupName: string;
  groupType: "PERSONAL" | "GUILD";
  role: "ADMIN" | "MEMBER";
  name?: string | null;
  image?: string | null;
};

export function MobileSidebar(props: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetHeader className="sr-only">
        <SheetTitle>Navigation Menu</SheetTitle>
      </SheetHeader>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] p-0">
        <SidebarContent {...props} />
      </SheetContent>
    </Sheet>
  );
}
