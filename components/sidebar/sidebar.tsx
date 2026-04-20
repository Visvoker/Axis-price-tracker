import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarNav, type NavItem } from "@/components/sidebar/sidebar-nav";

type SidebarProps = {
  groupId: string;
  groupName: string;
  groupType: "PERSONAL" | "GUILD";
  role: "ADMIN" | "MEMBER";
};

export function Sidebar({ groupId, groupName, groupType, role }: SidebarProps) {
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: `/${groupId}`,
      icon: "dashboard",
    },
    {
      title: "Items",
      href: `/${groupId}/items`,
      icon: "package",
    },
  ];

  if (groupType === "GUILD") {
    navItems.push({
      title: "Members",
      href: `/${groupId}/members`,
      icon: "users",
    });
  }

  navItems.push({
    title: "Settings",
    href: `/${groupId}/settings`,
    icon: "settings",
  });

  return (
    <aside className="w-72 border-r bg-muted/30 p-4">
      <div className="flex h-full flex-col gap-4">
        <Card>
          <CardHeader className="gap-2">
            <CardTitle className="text-base">
              <Link href={`/${groupId}`} className="hover:underline">
                {groupName}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{groupType}</Badge>
              <Badge variant={role === "ADMIN" ? "default" : "outline"}>
                {role}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-3">
            <SidebarNav items={navItems} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 ">logout</CardContent>
        </Card>
      </div>
    </aside>
  );
}
