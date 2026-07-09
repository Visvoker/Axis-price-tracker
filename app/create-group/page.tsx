import { CreateGroupForm } from "@/components/create-group-form";

type CreateGroupPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function CreateGroupPage({
  searchParams,
}: CreateGroupPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex flex-1 justify-center items-center">
      <CreateGroupForm
        title={"新增群組"}
        description={"建立另一個群組，和不同夥伴一起追蹤道具價格。"}
        submitLabel={"新增"}
        cancelHref={callbackUrl ?? "/"}
      />
    </div>
  );
}
