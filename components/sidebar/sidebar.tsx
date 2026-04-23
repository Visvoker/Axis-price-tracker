import { SidebarContent } from "./sidebar-content";

type SidebarProps = {
  groupId: string;
  groupName: string;
  groupType: "PERSONAL" | "GUILD";
  role: "ADMIN" | "MEMBER";
  name: string;
  image: string;
};

export function Sidebar({
  groupId,
  groupName,
  groupType,
  role,
  name,
  image,
}: SidebarProps) {
  return (
    <SidebarContent
      groupId={groupId}
      groupName={groupName}
      groupType={groupType}
      role={role}
      name={name}
      image={image}
    />
  );
}
