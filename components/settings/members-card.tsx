"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateInviteButton } from "@/components/create-invite-button";

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
  canManageMembers: boolean;
};

export function MembersCard({
  groupId,
  members,
  ownerId,
  canManageMembers,
}: MembersCardProps) {
  return (
    <Card className="gap-3 py-0 pt-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Members</CardTitle>

        {canManageMembers && <CreateInviteButton groupId={groupId} />}
      </CardHeader>

      <CardContent className="divide-y p-0 border-t">
        {members.map((member) => {
          const isOwner = member.userId === ownerId;

          const displayRole = isOwner
            ? "Owner"
            : member.role === "ADMIN"
              ? "Admin"
              : "Member";

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
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.user.email ?? "No email"}
                  </p>
                </div>
              </div>

              <Badge variant={isOwner ? "default" : "secondary"}>
                {displayRole}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
