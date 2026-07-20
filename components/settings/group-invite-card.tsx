"use client";

import toast from "react-hot-toast";
import { Copy } from "lucide-react";
import { useTransition } from "react";

import { Button } from "../ui/button";
import { CreateInviteButton } from "@/components/create-invite-button";

import { regenerateGroupInvite } from "@/lib/actions/group";
import { useRouter } from "next/navigation";

type ActiveInvite = {
  code: string;
  expiresAt: string | null;
};

type GroupInviteCardProps = {
  groupId: string;
  activeInvite: ActiveInvite | null;
};

export function GroupInviteCard({
  groupId,
  activeInvite,
}: GroupInviteCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!activeInvite) {
    return (
      <div className="space-y-2">
        <div className="rounded-lg flex flex-1 justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              目前沒有有效的邀請連結，點擊建立後會產生邀請連結
            </p>
          </div>
          <CreateInviteButton groupId={groupId} />
        </div>
      </div>
    );
  }

  const inviteUrl =
    typeof window === "undefined"
      ? `/invite/${activeInvite.code}`
      : `${window.location.origin}/invite/${activeInvite.code}`;

  const formattedExpiresAt = activeInvite.expiresAt
    ? new Date(activeInvite.expiresAt).toLocaleString("zh-TW")
    : "無期限";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("邀請連結已複製");
    } catch {
      toast.error("複製失敗，請手動複製");
    }
  };

  const regenerateInviteCode = () => {
    startTransition(async () => {
      try {
        await regenerateGroupInvite(groupId);
        toast.success("邀請連結已重新產生");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "邀請連結重新產生失敗",
        );
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-lg ">
        <div className="min-w-0 space-y-2">
          <div className="flex shrink-0 items-center">
            <p className="truncate text-sm font-medium">{inviteUrl}</p>
            <Button variant="ghost" size="xs" onClick={handleCopy}>
              <Copy className="size-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Expires at: {formattedExpiresAt}
          </p>
        </div>

        <Button
          variant="default"
          onClick={regenerateInviteCode}
          disabled={isPending}
        >
          重新產生
        </Button>
      </div>
    </>
  );
}
