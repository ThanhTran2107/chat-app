'use client';

import { useFriendStore } from '@/stores/use-friend-store';
import { type User } from '@/types/user.ts';
import { Bell, ChevronsUpDownIcon, UserIcon } from 'lucide-react';

import { useEffect, useState } from 'react';

import { ProfileDialog } from '@/pages/chat-page/components/profile/profile-dialog.component';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSidebar } from '@/components/ui/contexts/sidebar-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { FriendRequestDialog } from '../../pages/chat-page/components/friends/dialogs/friend-request-dialog.component';
import { LogoutButton } from '../../pages/chat-page/components/logout-button.component';

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const [friendRequestOpen, setFriendRequestOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const receivedCount = useFriendStore(state => state.receivedList.length);
  const getAllFriendRequests = useFriendStore(state => state.getAllFriendRequests);

  useEffect(() => {
    getAllFriendRequests();
  }, [getAllFriendRequests]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted cursor-pointer" />}
            >
              <Avatar>
                <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.displayName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {receivedCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-secondary-foreground group-hover/dropdown-menu-item:text-secondary-foreground! group-focus/dropdown-menu-item:text-secondary-foreground! ml-auto uppercase"
                  >
                    {receivedCount}
                  </Badge>
                )}
                <ChevronsUpDownIcon className="size-4" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                      <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 gap-0.5 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user.displayName} (<span className="truncate text-xs">@{user.username}</span>)
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setProfileOpen(true)} className="cursor-pointer">
                  <UserIcon className="text-muted-foreground dark:group-focus:text-accent-foreground!" />
                  Account
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setFriendRequestOpen(true)} className="cursor-pointer">
                  <Bell className="text-muted-foreground dark:group-focus:text-accent-foreground!" />
                  Notifications
                  {receivedCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-secondary-foreground group-hover/dropdown-menu-item:text-secondary-foreground! group-focus/dropdown-menu-item:text-secondary-foreground! ml-auto uppercase"
                    >
                      {receivedCount}
                    </Badge>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer" variant="destructive">
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <FriendRequestDialog open={friendRequestOpen} setOpen={setFriendRequestOpen} />

      <ProfileDialog open={profileOpen} setOpen={setProfileOpen} />
    </>
  );
}
