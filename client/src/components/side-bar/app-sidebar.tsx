'use client';

import { useThemeStore } from '@/stores/use-theme-store';
import { Moon, Sun } from 'lucide-react';

import * as React from 'react';

import { CreateNewChat } from '@/pages/chat-page/components/create-new-chat.component';
import { FriendChatList } from '@/pages/chat-page/components/friends/friend-chat-list.component';
// import { NewGroupChatModel } from '@/components/chat/new-group-chat-model';
import { GroupChatList } from '@/pages/chat-page/components/groups/group-chat-list.component';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/stores/use-auth-store';
import { NavUser } from './nav-user.tsx';
import { AddFriendModel } from '@/pages/chat-page/components/add-friend-model.component.tsx';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <Sidebar variant="inset" {...props}>
      {/* header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="bg-linear-to-r from-violet-700 via-fuchsia-600 to-pink-500 text-white shadow-lg shadow-violet-500/20 hover:opacity-95"
            >
              <div className="item-center flex w-full justify-between px-2">
                <h1 className="text-[1.5rem]! font-bold text-white">Moji</h1>
                <div className="flex items-center gap-2">
                  <Sun className="size-4 text-white/80" />
                  <Switch checked={isDark} onCheckedChange={toggleTheme} className="data-checked:bg-gray-300!" />
                  <Moon className="size-4 text-white/80" />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* content */}
      <SidebarContent className="beautiful-scrollbar">
        {/* new chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* group chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Groups</SidebarGroupLabel>
          <SidebarGroupAction title="Create Group Chat" className="cursor-pointer">
            {/* <NewGroupChatModel /> */}
          </SidebarGroupAction>

          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* direct chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Friends</SidebarGroupLabel>
          <SidebarGroupAction title="Add friend" className="cursor-pointer">
            <AddFriendModel />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <FriendChatList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* footer */}
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
