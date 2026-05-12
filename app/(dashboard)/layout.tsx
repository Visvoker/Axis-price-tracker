import { auth } from "@/auth";
import { PageContainer } from "@/components/home/page-container";
import { Topbar } from "@/components/home/topbar";
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

  if (!membership) {
    redirect("/select-group");
  }

  return (
    <div className="flex h-full overflow-hidden bg-muted">
      <div className="hidden md:flex">
        <Sidebar
          groupId={membership.group.id}
          groupName={membership.group.name}
          groupType={membership.group.type}
          role={membership.role}
          name={session.user.name}
          image={session.user.image}
        />
      </div>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col rounded-lg bg-background md:m-2 md:overflow-hidden ">
        <Topbar
          groupId={membership.group.id}
          groupName={membership.group.name}
          groupType={membership.group.type}
          role={membership.role}
          name={session.user.name}
          image={session.user.image}
        />
        <div className="flex min-h-0 flex-1 flex-col overflow-hiddens px-3 pb-3 md:px-6">
          <PageContainer>{children}</PageContainer>
        </div>
      </main>
    </div>
  );
}
