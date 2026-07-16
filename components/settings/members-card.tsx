"use client";

import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateInviteButton } from "@/components/create-invite-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeGroupMember, updateGroupMemberRole } from "@/lib/actions/group";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type Member = {
  id: string;
  userId: string;
  role: "ADMIN" | "MEMBER";
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

type MembersCardProps = {
  groupId: string;
  members: Member[];
  ownerId: string | null;
  isCurrentUserOwner: boolean;
  isCurrentUserAdmin: boolean;
  currentUserId: string;
};

export function MembersCard({
  groupId,
  members,
  ownerId,
  isCurrentUserOwner,
  isCurrentUserAdmin,
  currentUserId,
}: MembersCardProps) {
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const removingMember =
    members.find((member) => member.id === removingMemberId) ?? null;

  const canInviteMembers = isCurrentUserOwner || isCurrentUserAdmin;

  const handleUpdateRole = (memberId: string, role: "ADMIN" | "MEMBER") => {
    startTransition(async () => {
      try {
        await updateGroupMemberRole({
          groupId,
          memberId,
          role,
        });

        toast.success("成員權限已更新");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "更新成員權限失敗",
        );
      }
    });
  };

  const handleRemoveMember = () => {
    if (!removingMemberId) return;

    startTransition(async () => {
      try {
        await removeGroupMember({
          groupId,
          memberId: removingMemberId,
        });

        toast.success("成員已移除");
        setRemovingMemberId(null);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "移除成員失敗");
      }
    });
  };

  return (
    <>
      <Card className="gap-3 py-0 pt-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Members</CardTitle>

          {canInviteMembers && <CreateInviteButton groupId={groupId} />}
        </CardHeader>

        <CardContent className="divide-y p-0 border-t">
          {members.map((member) => {
            const isCurrentUser = member.userId === currentUserId;
            const isMemberOwner = member.userId === ownerId;
            const isMemberAdmin = member.role === "ADMIN";
            const isMemberRegular = member.role === "MEMBER";

            const canChangeRole = isCurrentUserOwner && !isMemberOwner;
            const canRemoveMember =
              !isMemberOwner &&
              (isCurrentUserOwner || (isCurrentUserAdmin && isMemberRegular));

            const displayRole = isMemberOwner
              ? "Owner"
              : member.role === "ADMIN"
                ? "Admin"
                : "Member";

            const canShowActions = canChangeRole || canRemoveMember;

            return (
              <div
                key={member.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar>
                    {member.user.image && (
                      <AvatarImage
                        src={member.user.image}
                        alt={member.user.name ?? "Member"}
                      />
                    )}
                    <AvatarFallback>
                      {(member.user.name ?? member.user.email ?? "M")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {member.user.name ?? "Unnamed member"}
                      {isCurrentUser && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (You)
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.user.email ?? "No email"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <Badge variant={isMemberOwner ? "default" : "secondary"}>
                    {displayRole}
                  </Badge>
                  {canShowActions && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Role change</DropdownMenuLabel>
                          {canChangeRole && isMemberRegular && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateRole(member.id, "ADMIN")
                              }
                            >
                              設為 Admin
                            </DropdownMenuItem>
                          )}

                          {canChangeRole && isMemberAdmin && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateRole(member.id, "MEMBER")
                              }
                            >
                              設為 Member
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                        {canRemoveMember && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-500 focus:bg-red-100 focus:text-red-500"
                              onClick={() => setRemovingMemberId(member.id)}
                            >
                              Remove member
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!removingMemberId}
        onOpenChange={(open) => {
          if (!open) setRemovingMemberId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>移除成員</AlertDialogTitle>
            <AlertDialogDescription>
              確定要將{"  "}
              <span className="text-lg font-bold text-black">
                {removingMember?.user.name ??
                  removingMember?.user.email ??
                  "這位成員"}
              </span>
              {"  "}移出群組嗎？
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>取消</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleRemoveMember}
              // className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              variant="destructive"
            >
              {isPending ? "移除中..." : "確認移除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
