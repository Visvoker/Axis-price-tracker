"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteGroup, leaveGroup, updateGroup } from "@/lib/actions/group";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type GroupManagementCardProps = {
  groupId: string;
  groupName: string;
  canUpdateGroup: boolean;
  canDeleteGroup: boolean;
};

export function GroupManagementCard({
  groupId,
  groupName,
  canUpdateGroup,
  canDeleteGroup,
}: GroupManagementCardProps) {
  const [name, setName] = useState(groupName);
  const [isUpdating, startUpdateTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const router = useRouter();

  const trimmedName = name.trim();

  const handleUpdate = () => {
    startUpdateTransition(async () => {
      try {
        await updateGroup(groupId, name);
        toast.success("群組名稱已更新");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "更新群組失敗");
      }
    });
  };

  const handleDelete = () => {
    startDeleteTransition(async () => {
      try {
        await deleteGroup(groupId);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "刪除群組失敗");
      }
    });
  };

  const handleleaveGroup = () => {
    startDeleteTransition(async () => {
      try {
        await leaveGroup(groupId);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "退出群組失敗");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">群組名稱</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between gap-2 pr-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!canUpdateGroup || isUpdating}
            className="w-full max-w-md"
            maxLength={32}
          />

          <Button
            onClick={handleUpdate}
            disabled={
              !canUpdateGroup || isUpdating || groupName === trimmedName
            }
          >
            {isUpdating ? "儲存中..." : "儲存"}
          </Button>
        </div>
      </CardContent>

      <CardContent>
        <div className="flex justify-between gap-2 pr-4">
          <div className="flex flex-col space-y-1 w-full">
            <p className="text-base font-medium ">退出群組</p>
            <div className="flex justify-between items-center">
              <p className="text-sm text-neutral-500">
                點擊退出，你將無法再次查看此群組的商品與價格紀錄。
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex items-center justify-start bg-red-50 p-3 sm:justify-end"
                  >
                    退出
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>確定要退出這個群組嗎？</AlertDialogTitle>
                    <AlertDialogDescription>
                      退出之後你將無法再查看、操作此群組的商品與價格紀錄。
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      取消
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={isDeleting}
                      onClick={handleleaveGroup}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/10"
                      variant="destructive"
                    >
                      {isDeleting ? "退出中..." : "確認退出"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>

      {canDeleteGroup && (
        <CardContent>
          <div className="flex justify-between gap-2 border border-destructive rounded-xl p-4 w-full ">
            <div className="flex flex-col space-y-1 w-full">
              <p className="text-base font-medium ">刪除群組</p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-neutral-500">
                  刪除後會移除商品、價格紀錄、分類和成員，且無法復原。
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center justify-start bg-red-50 p-3 sm:justify-end"
                    >
                      刪除
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        確定要刪除這個群組嗎？
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        刪除後會移除商品、價格紀錄、分類和成員，且無法復原。
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        取消
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isDeleting}
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/10"
                        variant="destructive"
                      >
                        {isDeleting ? "刪除中..." : "確認刪除"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
