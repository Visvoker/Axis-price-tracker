"use client";

import { useActionState } from "react";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createGroup } from "@/lib/actions/group";

type CreateGroupFormProps = {
  title?: string;
  description?: string;
  submitLabel?: string;
  cancelHref?: string;
};

export function CreateGroupForm({
  title = "建立你的第一個群組",
  description = "先建立一個群組 就能與夥伴們一起記錄道具價格",
  submitLabel = "建立",
  cancelHref,
}: CreateGroupFormProps) {
  const initialState = {
    error: null,
  };

  const [state, formAction, isPending] = useActionState(
    createGroup,
    initialState,
  );

  return (
    <Card className="w-full max-w-md ">
      <form action={formAction}>
        <div className="space-y-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-">
            <div>
              <Input id="name" name="name" placeholder="Axis Guild" />
            </div>
            <span>
              {state.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
            </span>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            {cancelHref && (
              <Button type="button" variant="outline" asChild size="lg">
                <Link href={cancelHref}>取消</Link>
              </Button>
            )}

            <Button type="submit" disabled={isPending} size="lg">
              {isPending ? `${submitLabel}中...` : submitLabel}
            </Button>
          </CardFooter>
        </div>
      </form>
    </Card>
  );
}
