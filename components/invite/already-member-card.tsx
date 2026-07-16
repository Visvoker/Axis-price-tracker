import { InviteStatusCard } from "./invite-status-card";

type AlreadyMemberCardProps = {
  groupId: string;
};

export function AlreadyMemberCard({ groupId }: AlreadyMemberCardProps) {
  return (
    <div className="flex min-h-screen justify-center items-center px-4">
      <InviteStatusCard
        description="你已經加入這個群組，可以直接前往群組查看商品價格與價格紀錄。"
        title="你已經是群組成員"
        actionLabel="前往群組"
        actionHref={`/${groupId}`}
        secondaryLabel="返回首頁"
        secondaryHref="/"
      />
    </div>
  );
}
