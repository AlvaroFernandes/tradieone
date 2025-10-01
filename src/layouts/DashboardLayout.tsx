import type { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import AppSidebar from '../components/AppSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen min-w-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 w-full p-8 bg-gray-50">
            <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
