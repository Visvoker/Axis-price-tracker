"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createGroup(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const name = formData.get("name")?.toString().trim();

  if (!name) {
    throw new Error("Group 名稱不能為空");
  }

  const group = await prisma.group.create({
    data: {
      name,
      type: "PERSONAL",
      members: {
        create: {
          userId: session.user.id,
          role: "ADMIN",
        },
      },
    },
  });

  redirect(`/${group.id}`);
}
