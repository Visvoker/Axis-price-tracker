import { InviteStatusCard } from "./invite-status-card";

export function InvalidInviteCard() {
  return (
    <div className="flex min-h-screen justify-center items-center px-4">
      <InviteStatusCard
        title="邀請不存在"
        description="這個邀請連結可能已被刪除，或連結內容不正確。"
        actionLabel="返回首頁"
        actionHref="/"
      />
    </div>
  );
}
