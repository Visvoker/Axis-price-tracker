import { InviteStatusCard } from "./invite-status-card";

export function InviteGroupFullCard() {
  return (
    <div className="flex min-h-screen justify-center items-center px-4">
      <InviteStatusCard
        title="群組人數已滿"
        description="這個群組目前已達成員上限，暫時無法加入。"
        actionLabel="返回首頁"
        actionHref="/"
      />
    </div>
  );
}
