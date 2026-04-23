import { SidebarNav, type NavItem } from "@/components/sidebar/sidebar-nav";
import { SidebarUser } from "./sidebar-user";

type SidebarContentProps = {
  groupId: string;
  groupName: string;
  groupType: "PERSONAL" | "GUILD";
  role: "ADMIN" | "MEMBER";
  name: string;
  image: string;
};

export function SidebarContent({
  groupId,
  groupName,
  groupType,
  role,
  name,
  image,
}: SidebarContentProps) {
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
    {
      title: "Price Records",
      href: `/${groupId}/price-records`,
      icon: "badgeDollarSign",
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
    <aside className="flex h-screen w-72 flex-col justify-between px-4 py-5">
      <div className="space-y-6">
        <div className="px-2">
          <h1 className="text-xl font-semibold tracking-tight">
            AxisPriceTracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Guild Price Tracker
          </p>
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
