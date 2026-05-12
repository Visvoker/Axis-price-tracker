import { ActivitySection } from "@/components/home/activity-section";
import { MembersSection } from "@/components/home/members-section";
import { TrendingItemSection } from "@/components/home/trending-item-section";

type HomePageProps = {
  params: {
    groupId: string;
  };
};

export default function HomePage({ params }: HomePageProps) {
  const { groupId } = params;

  return (
    <main className="flex h-full min-h-0 flex-col pt-3">
      <section className="grid min-h-0 flex-1 gap-6 grid-rows-[minmax(225px,3fr)_minmax(145px,2fr)]">
        <div className="min-h-0">
          <ActivitySection groupId={groupId} />
        </div>

        <div className="grid min-h-0 gap-6 md:grid-cols-2">
          <TrendingItemSection />
          <MembersSection />
        </div>
      </section>
    </main>
  );
}
