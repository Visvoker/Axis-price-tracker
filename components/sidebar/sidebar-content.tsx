import { SidebarNav, type NavItem } from "@/components/sidebar/sidebar-nav";
import { SidebarUser } from "./sidebar-user";
import { WorkspaceSwitcher } from "./workspace-switcher";

type SidebarContentProps = {
  groupId: string;
  groupName: string;
  role: "ADMIN" | "MEMBER";
  name?: string | null;
  image?: string | null;
  groups: {
    id: string;
    name: string;
    role: "ADMIN" | "MEMBER";
  }[];
};

export function SidebarContent({
  groupId,
  groupName,
  role,
  name,
  image,
  groups,
}: SidebarContentProps) {
  const navItems: NavItem[] = [
    {
      title: "Home",
      href: `/${groupId}`,
      icon: "Home",
    },
    {
      title: "Items",
      href: `/${groupId}/items`,
      icon: "package",
    },
    {
      title: "Price Records",
      href: `/${groupId}/price-records`,
      icon: "badgeDollarSign",
    },
    {
      title: "Settings",
      href: `/${groupId}/settings`,
      icon: "settings",
    },
  ];

  return (
    <aside className="flex h-screen w-60 flex-col justify-between px-3 py-5 md:bg-muted">
      <div className="space-y-3">
        <div className="px-3">
          <h1 className="text-xl font-semibold tracking-tight">AxisCult</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Guild Price Tracker
          </p>
        </div>
        <div className="mx-2 border-t border-[#E7E8E7]" />

        <div className="">
          <WorkspaceSwitcher
            currentGroupId={groupId}
            currentGroupName={groupName}
            groups={groups}
          />
        </div>

        <div className="mx-2 border-t border-[#E7E8E7]" />
        <nav>
          <SidebarNav items={navItems} />
        </nav>
      </div>

      <div className="mx-2 border-t border-[#E7E8E7] pt-4 flex items-center gap-3 text-lg">
        <SidebarUser name={name} image={image} />
      </div>
    </aside>
  );
}
