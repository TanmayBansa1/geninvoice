"use client"
import * as React from "react"
import { CreditCard, HomeIcon, Infinity, Info, ChevronRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
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

export function AppSidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({})

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const { data: user, isLoading } = api.user.me.useQuery();

  return (
    <Sidebar className="[&>div]:bg-transparent [&>div]:border-transparent [&>div]:shadow-none">
      <SidebarHeader className="p-4 border-b border-emerald-300/50 backdrop-blur-sm bg-white/20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <Infinity className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-emerald-900">GenInvoice</span>
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {data.navMain.map((group, groupIndex) => (
          <SidebarGroup key={group.title}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
            >
              <SidebarGroupLabel
                className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-emerald-800 cursor-pointer hover:bg-emerald-200/30 rounded-md transition-colors"
                onClick={() => toggleGroup(group.title)}
              >
                <span>{group.title}</span>
                <motion.div
                  animate={{ rotate: expandedGroups[group.title] ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              </SidebarGroupLabel>

              <AnimatePresence>
                {expandedGroups[group.title] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SidebarMenu>
                      {group.items.map((item, itemIndex) => (
                        <SidebarMenuItem key={item.title}>
                          <Link href={item.url}>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                              whileHover={{ x: 5 }}
                            >
                              <SidebarMenuButton
                                isActive={pathname === item.url}
                                className={cn(
                                  "group relative overflow-hidden",
                                  "before:absolute before:inset-0 before:bg-emerald-200/40 before:translate-x-[-100%] before:transition-transform",
                                  "hover:before:translate-x-0",
                                  pathname === item.url && "before:translate-x-0"
                                )}
                              >
                                <item.icon className="w-4 h-4 text-emerald-800" />
                                <span>{item.title}</span>
                                <motion.div
                                  className="absolute right-2"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronRight className="w-4 h-4 text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                              </SidebarMenuButton>
                            </motion.div>
                          </Link>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {!isLoading && !user?.address ? (
        <SidebarGroup>
          <SidebarGroupLabel>
            <p className="font-medium text-xl text-emerald-900 mb-4">
              Settings
            </p>
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link 
                  href="/onboard" 
                  className="py-8 bg-gradient-to-r from-amber-400 to-amber-500 w-full rounded-full p-4 mx-auto group 
                    hover:from-amber-300 hover:to-amber-400
                    hover:text-yellow-900 
                    hover:scale-105 
                    transition-all 
                    duration-300 shadow-sm"
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
    </Sidebar>
  )
}
