import { PriceRecordsClient } from "@/components/price-records-client";
import { getItemsByGroupId, getItemWithPrices } from "@/lib/queries/item";

type PriceRecordsPageProps = {
  params: Promise<{
    groupId: string;
  }>;
  searchParams: Promise<{ itemId?: string }>;
};

export default async function PriceRecordsPage({
  params,
  searchParams,
}: PriceRecordsPageProps) {
  const { groupId } = await params;
  const { itemId } = await searchParams;

  const items = await getItemsByGroupId(groupId);

  const selectedItem = itemId ? await getItemWithPrices(itemId, groupId) : null;

  return (
    <PriceRecordsClient
      key={groupId}
      groupId={groupId}
      items={items}
      initialSelectedItem={selectedItem}
    />
  );
}
