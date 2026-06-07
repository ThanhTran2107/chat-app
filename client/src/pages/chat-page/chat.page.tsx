import { ChatWindowLayout } from '@/pages/chat-page/layouts/chat-window.layout';

import { AppSidebar } from '@/components/side-bar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export const ChatPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex h-screen w-full p-2">
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  );
};
