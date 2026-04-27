import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type PriceRecordsPageProps = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function PriceRecordsPage({
  params,
}: PriceRecordsPageProps) {
  const { groupId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Price Records</h1>
        <p className="text-sm text-muted-foreground">
          Search an item to view its price trends and history.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search item name..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
          <p className="text-sm font-medium">No item selected</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Search and select an item to view its price chart.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
