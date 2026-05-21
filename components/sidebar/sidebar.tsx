import { SidebarContent } from "./sidebar-content";

type SidebarProps = {
  groupId: string;
  groupName: string;
  role: "ADMIN" | "MEMBER";
  name?: string | null;
  image?: string | null;
};

export function Sidebar({
  groupId,
  groupName,
  role,
  name,
  image,
}: SidebarProps) {
  return (
    <SidebarContent
      groupId={groupId}
      groupName={groupName}
      role={role}
      name={name}
      image={image}
    />
  );
}
