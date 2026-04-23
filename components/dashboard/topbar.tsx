import { MobileSidebar } from "../sidebar/mobile-sidebar";
import { Button } from "../ui/button";

type TopbarProps = {
  groupId: string;
  groupName: string;
  groupType: "PERSONAL" | "GUILD";
  role: "ADMIN" | "MEMBER";
  name?: string | null;
  image?: string | null;
};

export function Topbar(props: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="min-w-0">
        <MobileSidebar {...props} />
        <p className="truncate text-sm font-medium text-foreground hidden md:block">
          {props.groupName}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button>Create Item</Button>
      </div>
    </header>
  );
}
