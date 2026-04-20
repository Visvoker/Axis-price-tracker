import { auth } from "@/auth";
import { Sidebar } from "@/components/sidebar/sidebar";
import { getGroupWithMembership } from "@/lib/queries/group";
import { redirect } from "next/navigation";

type DashboardLayoutProp = {
  children: React.ReactNode;
  params: { groupId: string };
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProp) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership = await getGroupWithMembership(
    session.user.id,
    params.groupId,
  );

  console.log(membership);

  if (!membership) {
    redirect("/select-group");
  }

  return (
    <div className="flex">
      <Sidebar
        groupId={membership.group.id}
        groupName={membership.group.name}
        groupType={membership.group.type}
        role={membership.role}
      />
      <main>{children}</main>
    </div>
  );
}
