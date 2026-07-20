"use client";

import toast from "react-hot-toast";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { createGroupInvite } from "@/lib/actions/group";

type CreateInviteButtonProps = {
  groupId: string;
};

export function CreateInviteButton({ groupId }: CreateInviteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      try {
        await createGroupInvite(groupId);
        toast.success("已成功建立邀請連結");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "邀請連結建立失敗",
        );
      }
    });
  };

  return (
    <Button onClick={handleCreate} disabled={isPending}>
      {isPending ? "建立中..." : "建立"}
    </Button>
  );
}
