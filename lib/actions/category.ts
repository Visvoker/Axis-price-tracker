"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function createCategory({
  groupId,
  name,
}: {
  groupId: string;
  name: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Category name is required");
  }

  const membership = await prisma.groupMember.findFirst({
    where: {
      groupId,
      userId: session.user.id,
    },
  });

  if (!membership) {
    throw new Error("No permission");
  }

  const category = await prisma.category.upsert({
    where: {
      groupId_name: {
        groupId,
        name: trimmedName,
      },
    },
    update: {},
    create: {
      groupId,
      name: trimmedName,
    },
  });

  return {
    id: category.id,
    name: category.name,
  };
}

export async function updateCategory({
  groupId,
  categoryId,
  name,
}: {
  groupId: string;
  categoryId: string;
  name: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Category name is required");
  }

  const membership = await prisma.groupMember.findFirst({
    where: {
      groupId,
      userId: session.user.id,
    },
  });

  if (!membership) {
    throw new Error("No permission");
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      groupId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      groupId,
      name: trimmedName,
      NOT: {
        id: categoryId,
      },
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  return prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: trimmedName,
    },
  });
}

export async function deleteCategory({
  groupId,
  categoryId,
}: {
  groupId: string;
  categoryId: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const membership = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId,
      },
    },
  });

  if (!membership) {
    throw new Error("No permission");
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      groupId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const itemCount = await prisma.item.count({
    where: { categoryId },
  });

  if (itemCount > 0) {
    throw new Error("Cannot delete category because it is used by items");
  }

  return prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
}
