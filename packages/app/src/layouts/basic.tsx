import { Package } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar'

export default function BasicLayout() {
  const { pathname } = useLocation()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Staffs
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={pathname === '/staffs/model-manager'} asChild>
                    <NavLink to="/staffs/model-manager">
                      <Package />
                      <span>Model Manager</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              Settings
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={pathname === '/models'} asChild>
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
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
