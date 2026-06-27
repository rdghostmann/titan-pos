// app-sidebar.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  Gear,
  Question,
  MagnifyingGlass,
  Command,
} from "@phosphor-icons/react"

import { NavMain } from "@/components/dashboard/nav-main"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { roleNavMain } from "@/lib/roles_nav"
import Image from "next/image"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"

type UserRole = keyof typeof roleNavMain

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  // Get current user role
  const role = session?.user?.role as UserRole | undefined

  // Dynamically get nav items based on role
  const navMain = role ? roleNavMain[role] || [] : []

  const data = {
    user: {
      name: `${session?.user?.firstName || ""} ${session?.user?.lastName || ""}`.trim() || "Guest",
      email: session?.user?.email || "guest@example.com",
      avatar: "/avatars/shadcn.webp",
    },
    navMain,
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: <Gear />,
      },
      {
        title: "Get Help",
        url: "#",
        icon: <Question />,
      },
      {
        title: "Search",
        url: "#",
        icon: <MagnifyingGlass />,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
    {/* <Sidebar collapsible="offcanvas" {...props}> */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/">
                <Command className="size-5!" />
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  TitanPOS
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}