"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";

type LoginFormProps = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Axis Price Tracker</CardTitle>
          <CardDescription>
            使用 Google 或
            Discord登入，登入後可以開始記錄商品價格、查看價格紀錄與追蹤商品價格變化。
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl })}
          >
            Login with Google <FcGoogle className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("discord", { callbackUrl })}
          >
            Login with Discord <FaDiscord className="size-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
