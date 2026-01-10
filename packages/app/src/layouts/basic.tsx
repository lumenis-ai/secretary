import { Package } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar'

export default function BasicLayout() {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Settings
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/models">
                      <Package />
                      <span>Models</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-2">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
