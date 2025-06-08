import { Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";

export function RootLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="container py-8">
        <div className="fixed z-50 top-1">

          <SidebarTrigger />
        </div>
        <Outlet />
      </main>
    </SidebarProvider >
  );
}