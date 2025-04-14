"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { User2, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboardIcon, CreditCard } from "lucide-react";

export function UserProfile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center rounded-full border-1 text-green-500">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus:ring-0 focus:outline-none cursor-pointer">
        <div className="flex items-center justify-center rounded-full border-1 text-green-500">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="User profile"
              width={64}
              height={128}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <User2 className="size-6" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-4" onClick={() => router.push("/dashboard")}>
          <LayoutDashboardIcon className="mr-2 size-5" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem className="p-4" onClick={() => router.push("/invoices")}>
          <CreditCard className="mr-2 size-5" /> Invoices
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-4 text-red-600" onClick={handleSignOut}>
          <LogOut className="mr-2 size-5" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 