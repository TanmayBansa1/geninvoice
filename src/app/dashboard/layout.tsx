"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import Image from "next/image";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { User2, LogOut, LayoutDashboardIcon, CreditCard } from "lucide-react";
import { api } from "@/trpc/react";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { handleSignout } from "@/lib/actions/auth-actions";
import { useRouter } from "next/navigation";
type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  const user = api.user.me.useQuery();
  const router = useRouter();
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar></AppSidebar>
      <SidebarInset className="w-full">
        <header className="flex h-16 w-full shrink-0 items-center justify-between gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none focus:ring-0 focus:outline-none">
              <div className="flex items-center justify-center rounded-full border-1 text-green-500">
                {user.data?.image ? (
                  <Image
                    src={user.data.image}
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
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <DropdownMenuItem className="p-4"  onClick={() => {
                router.push("/dashboard");
              }}>
                <LayoutDashboardIcon className="size-6" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4"  onClick={() => {
                router.push("/dashboard/invoice");
              }}>
                <CreditCard className="size-6" /> Invoices
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4"
                onClick={async () => {
                  await handleSignout();
                }}
              >
                <LogOut className="size-6" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="m-2 max-w-full">
          {/* main content */}
          <div className="border-sidebar-border no-scrollbar h-[calc(100vh-6rem)] w-full overflow-y-auto rounded-md border p-4 shadow">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
