import { PriceRecordsClient } from "@/components/price-records/price-records-client";
import { getItemsByGroupId } from "@/lib/queries/item";

type PriceRecordsPageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function PriceRecordsPage({
  params,
}: PriceRecordsPageProps) {
  const { groupId } = await params;

  const items = await getItemsByGroupId(groupId);

  return <PriceRecordsClient groupId={groupId} items={items} />;
}
