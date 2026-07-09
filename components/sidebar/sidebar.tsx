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
};

export function Sidebar({
  groupId,
  groupName,
  role,
  name,
  image,
  groups,
}: SidebarProps) {
  return (
    <SidebarContent
      groupId={groupId}
      groupName={groupName}
      role={role}
      name={name}
      image={image}
      groups={groups}
    />
  );
}
