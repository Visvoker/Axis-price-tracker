import { ActivitySection } from "@/components/home/activity-section";

import { TopMoversSection } from "@/components/home/top-movers-section";

type HomePageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { groupId } = await params;

  return (
    <main className="flex h-full min-h-0 flex-col pt-6">
      <section className="grid min-h-0 flex-1 gap-6">
        <div className="min-h-0">
          <ActivitySection groupId={groupId} />
        </div>

        <div className="grid min-h-0 gap-6 md:grid-cols-2">
          <TopMoversSection groupId={groupId} />
        </div>
      </section>
    </main>
  );
}
