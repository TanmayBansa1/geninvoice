"use client"
import * as React from "react"
import { CreditCard, HomeIcon, Infinity, Info } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
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
import { api } from "@/trpc/react"

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
          url: "/invoices",
          icon: CreditCard
        }

      ],
    },

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: user, isLoading } = api.user.me.useQuery();
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center justify-center rounded-lg text-green-400">
                  <Infinity className="size-12" />
                </div>
                <div className="flex gap-0.5 leading-none">
                  <h1 className="flex font-semibold text-4xl ml-2">Gen <span className="text-green-400">Invoice</span></h1>
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
                          <Link 
                            href={item.url} 
                            className={cn(
                              "group flex items-center w-full p-2 rounded-md transition-all duration-300",
                              "hover:bg-green-100 hover:text-green-900 hover:scale-105",
                              pathname === item.url ? "bg-green-200" : ""
                            )}
                          >
                            <item.icon className="size-6 mr-2 group-hover:text-green-900 transition-colors duration-300" />
                            <span className="group-hover:text-green-900 transition-colors duration-300">
                              {item.title}
                            </span>
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
        {!isLoading && !user?.address ? (
          <SidebarGroup>
            <SidebarGroupLabel>
              <p className="font-medium text-xl text-green-800 mb-4">
                Settings
              </p>
            </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link 
                  href="/onboard" 
                  className="py-8 bg-amber-300 w-full rounded-full p-4 mx-auto group 
                    hover:bg-amber-100 
                    hover:text-yellow-900 
                    hover:scale-105 
                    transition-all 
                    duration-300"
                >
                <Info className="size-6 group-hover:text-yellow-900" />
                  <p className="font-medium text-yellow-800 group-hover:text-yellow-900 transition-colors duration-300">
                    Finish Setting up your profile
                  </p>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        ) : null}
      </SidebarContent>
    </Sidebar>
  )
}
