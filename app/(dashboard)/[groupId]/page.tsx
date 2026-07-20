import { ActivitySection } from "@/components/home/activity-section";
import { DashboardSummary } from "@/components/home/dashboard-summary";

import { TopMoversSection } from "@/components/home/top-movers-section";

type HomePageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { groupId } = await params;

  return (
    <main className="flex h-full min-h-0 flex-col pt-6 gap-y-3 w-full">
      <DashboardSummary groupId={groupId} />
      <section className="flex md:min-h-0 flex-col gap-3 lg:flex-row">
        <div className="min-w-0 flex-1">
          <ActivitySection groupId={groupId} />
        </div>

        <div className="min-w-0 flex-1">
          <TopMoversSection groupId={groupId} />
        </div>
      </section>
    </main>
  );
}
