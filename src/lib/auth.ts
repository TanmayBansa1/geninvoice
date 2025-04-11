import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  
  if (!session || !session.userId) {
    return null;
  }
  
  return { id: session.userId };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  return user;
} 