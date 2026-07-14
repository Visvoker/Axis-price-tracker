import { SidebarContent } from "./sidebar-content";

type SidebarProps = {
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
  ownerName: string;
};

export function Sidebar({
  groupId,
  groupName,
  role,
  name,
  image,
  groups,
  ownerName,
}: SidebarProps) {
  return (
    <SidebarContent
      groupId={groupId}
      groupName={groupName}
      role={role}
      name={name}
      image={image}
      groups={groups}
      ownerName={ownerName}
    />
  );
}
