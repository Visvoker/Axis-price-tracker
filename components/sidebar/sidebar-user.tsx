"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type SidebarUserProps = {
  name?: string | null;
  image?: string | null;
};

export function SidebarUser({ name, image }: SidebarUserProps) {
  return (
    <div className="flex flex-1 items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={image ?? undefined} alt={name ?? "avatar"} />
          <AvatarFallback> {name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>

        <span className="text-sm font-medium text-foreground">
          {name || "User"}
        </span>
      </div>

      <button
        type="button"
        onClick={() => signOut()}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
