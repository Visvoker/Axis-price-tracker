"use client";

import Link from "next/link";
import { ChevronsUpDown, CircleCheck, Plus, Crown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

type WorkspaceSwitcherProps = {
  currentGroupId: string;
  currentGroupName: string;
  groups: {
    id: string;
    name: string;
    role: "ADMIN" | "MEMBER";
  }[];
  ownerName: string;
};

export function WorkspaceSwitcher({
  currentGroupId,
  currentGroupName,
  groups,
  ownerName,
}: WorkspaceSwitcherProps) {
  const groupInitialName =
    currentGroupName.trim().charAt(0).toUpperCase() || "A";

  return (
    <DropdownMenu modal={false}>
      <div className="flex w-full items-center gap-3 px-2 py-2.5 rounded-xl text-left">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-chart-4 text-background">
          {groupInitialName}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{currentGroupName}</p>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Crown className="size-3 shrink-0" />
            <span className="truncate">{ownerName}</span>
          </p>
        </div>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent align="end" className="w-54 mt-2 ml-3">
        {groups.map((group) => {
          const isActive = group.id === currentGroupId;
          return (
            <DropdownMenuItem key={group.id} asChild>
              <Link
                href={`/${group.id}`}
                className="flex w-full items-center gap-2"
              >
                <span className="truncate">{group.name}</span>

                {isActive && (
                  <CircleCheck
                    className="ml-auto size-4"
                    style={{ stroke: "var(--primary)" }}
                  />
                )}
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator className="m-2" />

        <DropdownMenuItem asChild>
          <Link href={`/create-group?callbackUrl=/${currentGroupId}`}>
            <Plus className="size-4" />
            建立新的群組
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
