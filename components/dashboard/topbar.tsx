import { Button } from "../ui/button";

type TopbarProps = {
  groupName: string;
};

export function Topbar({ groupName }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {groupName}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button>Create Item</Button>
      </div>
    </header>
  );
}
