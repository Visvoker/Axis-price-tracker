import Link from "next/link";
import { Crown, Users, Store } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AcceptInviteButton } from "@/components/invite/accept-invite-button";

type InviteConfirmCardProps = {
  code: string;
  groupName: string;
  ownerName: string;
  memberCount: number;
  maxMembers: number;
};

export function InviteConfirmCard({
  code,
  groupName,
  ownerName,
  memberCount,
  maxMembers,
}: InviteConfirmCardProps) {
  return (
    <Card className="w-full max-w-md overflow-hidden py-0 pt-4">
      <CardHeader className="items-center text-center">
        <CardDescription>你收到一個群組邀請</CardDescription>
        <CardTitle className="text-2xl">{groupName}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          加入後，你可以和群組成員一起記錄商品價格、查看價格紀錄與追蹤商品價格變化。
        </p>

        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <Store className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">群組</span>
            </div>

            <p className="truncate text-sm font-medium">{groupName}</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <Crown className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Owner</span>
            </div>

            <p className="truncate text-sm font-medium">{ownerName}</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <Users className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Members</span>
            </div>

            <p className="text-sm font-medium">
              {memberCount} / {maxMembers}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 border-t bg-muted/40 pb-4">
        <Button variant="outline" asChild>
          <Link href="/select-group">返回</Link>{" "}
        </Button>

        <AcceptInviteButton code={code} />
      </CardFooter>
    </Card>
  );
}
