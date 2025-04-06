"use client"
import * as React from "react"
import { CreditCard, HomeIcon, Infinity } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: HomeIcon
        },
      ],
    },
    {
      title: "Building Your Invoices",
      url: "#",
      items: [
        {
          title: "Invoices",
          url: "/dashboard/invoice",
          icon: CreditCard
        }

      ],
    },

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center justify-center rounded-lg text-green-500">
                  <Infinity className="size-12" />
                </div>
                <div className="flex gap-0.5 leading-none">
                  <h1 className="flex font-semibold text-4xl ml-2">Gen <span className="text-green-500">Invoice</span></h1>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-5">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="font-medium text-xl text-green-800">
                    
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5 py-3">
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild >
                          <Link className={cn(
                            pathname === item.url ? "bg-green-200 rounded-lg " : "", 
                            "text-lg hover:scale-105 hover:bg-green-400"
                          )} href={item.url}>
                            <item.icon className="size-6" />
                            {item.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
