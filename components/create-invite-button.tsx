"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createGroupInvite } from "@/lib/actions/group";

type CreateInviteButtonProps = {
  groupId: string;
};

export function CreateInviteButton({ groupId }: CreateInviteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    startTransition(async () => {
      await createGroupInvite(groupId);
    });
  }

  return (
    <Button onClick={handleCreate} disabled={isPending}>
      {isPending ? "Creating..." : "Create Invite Link"}
    </Button>
  );
}
