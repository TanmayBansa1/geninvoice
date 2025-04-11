import { syncUser } from "@/lib/actions/sync-user";
import { redirect } from "next/navigation";

export default async function SyncPage() {
  const user = await syncUser();
  
  if (!user) {
    throw new Error("Failed to sync user");
  }

  if (!user.address) {
    redirect("/onboard");
  }

  redirect("/dashboard");
} 