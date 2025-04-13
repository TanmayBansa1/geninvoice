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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-200/10 via-transparent to-transparent" />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="w-full">
          <header className="flex h-16 w-full shrink-0 items-center justify-between gap-2 px-4 border-b border-emerald-100/30 backdrop-blur-sm bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/80">
            <SidebarTrigger className="-ml-1" />
            <UserProfile />
          </header>
          <main className=" max-w-full bg-gradient-to-tr from-emerald-50/80 via-white to-emerald-50/80">
            <div className="h-[calc(100vh-5rem)] w-full overflow-y-auto rounded-md p-4">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
