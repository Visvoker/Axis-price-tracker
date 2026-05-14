import { getTopMoversByGroupId } from "@/lib/queries/price";
import { TopMoversTabs } from "./top-movers-tabs";

type TopMoversSectionProps = {
  groupId: string;
};

export async function TopMoversSection({ groupId }: TopMoversSectionProps) {
  const movers = await getTopMoversByGroupId(groupId, 7);

  return <TopMoversTabs groupId={groupId} movers={movers} />;
}
