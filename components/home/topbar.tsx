"use client";

import { useRouter } from "next/navigation";
import { CreateItemDialog } from "../items/create-item-dialog";
import { MobileSidebar } from "../sidebar/mobile-sidebar";

import { createItem } from "@/lib/actions/item";

type TopbarProps = {
  groupId: string;
  groupName: string;
  role: "ADMIN" | "MEMBER";
  name?: string | null;
  image?: string | null;
  categories: {
    id: string;
    name: string;
  }[];
};

export function Topbar(props: TopbarProps) {
  const { groupId } = props;
  const router = useRouter();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-3 ">
      <div className="min-w-0">
        <MobileSidebar {...props} />
        <p className="truncate text-sm font-medium text-foreground hidden md:block">
          {props.groupName}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <CreateItemDialog
          groupId={groupId}
          categories={props.categories}
          onSubmit={async (values) => {
            await createItem({
              groupId,
              name: values.name,
              categoryId: values.category,
              price: values.price,
            });

            router.refresh();
          }}
        />
      </div>
    </header>
  );
}
