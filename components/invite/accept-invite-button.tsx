"use client";

import { useTransition } from "react";

import { Button } from "../ui/button";

import { acceptGroupInvite } from "@/lib/actions/group";

export function AcceptInviteButton({ code }: { code: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await acceptGroupInvite(code);
        });
      }}
    >
      {isPending ? "加入中..." : "接受邀請"}
    </Button>
  );
}
