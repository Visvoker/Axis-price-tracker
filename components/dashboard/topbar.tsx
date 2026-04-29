"use client";

import { useRouter } from "next/navigation";
import { CreateItemDialog } from "../items/create-item-dialog";
import { MobileSidebar } from "../sidebar/mobile-sidebar";

import { createItem } from "@/lib/actions/item";

type TopbarProps = {
  groupId: string;
  groupName: string;
  groupType: "PERSONAL" | "GUILD";
  role: "ADMIN" | "MEMBER";
  name?: string | null;
  image?: string | null;
};

export function Topbar(props: TopbarProps) {
  const router = useRouter();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="min-w-0">
        <MobileSidebar {...props} />
        <p className="truncate text-sm font-medium text-foreground hidden md:block">
          {props.groupName}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <CreateItemDialog
          onSubmit={async (values) => {
            await createItem({
              name: values.name,
              category: values.category,
              price: values.price,
            });

            router.refresh();
          }}
        />
      </div>
    </header>
  );
}
