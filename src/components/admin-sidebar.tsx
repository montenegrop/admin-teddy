import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { Link } from "@tanstack/react-router"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Inbox,
  },
  {
    title: "Call Logs",
    url: "/calls",
    icon: Calendar,
  },
  {
    title: "Text Logs",
    url: "/texts",
    icon: Search,
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
]

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="bg-blue-600 text-white font-bold text-xl h-16 flex items-center rounded-none justify-center">
            Admin Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className="flex items-center gap-2 w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}