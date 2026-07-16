import { InviteStatusCard } from "./invite-status-card";

export function ExpiredInviteCard() {
  return (
    <div className="flex min-h-screen justify-center items-center px-4">
      <InviteStatusCard
        title="邀請已過期"
        description="這個邀請連結已經失效，請向群組管理員索取新的邀請連結。"
        actionLabel="返回首頁"
        actionHref="/"
      />
    </div>
  );
}
