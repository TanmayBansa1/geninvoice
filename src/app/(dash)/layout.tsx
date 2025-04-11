"use client";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserProfile } from "@/components/user-profile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <UserProfile />
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
}
