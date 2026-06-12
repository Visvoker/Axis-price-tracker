import { prisma } from "@/lib/db";

export async function getCategoriesByGroupId(groupId: string) {
  return prisma.category.findMany({
    where: {
      groupId,
    },
    orderBy: {
      name: "asc",
    },
  });
}
