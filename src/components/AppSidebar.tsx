import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { MenuItems } from "../assets/data/MenuItems";
import { logout } from "../services/auth";


const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>TradieOne</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MenuItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.path} className="flex items-center gap-3 w-full">
                      <item.icon className="text-lg" />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* user Name and Logout button */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">John Doe</div>
            <button className="text-sm text-red-500 hover:text-red-700" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </SidebarFooter>
      
    </Sidebar>
  );
}

export default AppSidebar