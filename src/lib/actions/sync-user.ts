"use server"

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/server/db";

export async function syncUser() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  
  if (!user.emailAddresses[0]?.emailAddress) {
    throw new Error("User not found");
  }

  const userData = {
    email: user.emailAddresses[0].emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
    imageUrl: user.imageUrl,
  };

  const dbUser = await db.user.upsert({
    where: {
      clerkId: user.id,
    },
    update: userData,
    create: {
      clerkId: user.id,
      ...userData,
    },
  });

  return dbUser;
} 