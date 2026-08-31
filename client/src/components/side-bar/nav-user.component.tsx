'use client';

import { useAuthStore } from '@/stores/use-auth.store';
import { useFriendStore } from '@/stores/use-friend.store';
import { type User } from '@/types/user.type';
import { Bell, ChevronsUpDownIcon, UserIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileDialog } from '@/pages/chat-page/components/profile/profile-dialog.component';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.component';
import { Badge } from '@/components/ui/badge.component.';
import { useSidebar } from '@/components/ui/contexts/sidebar.context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.component';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar.component';

import { ROUTES } from '@/utils/constants';

import { getApiErrorMessage } from '@/lib/axios';

import { FriendRequestDialog } from '../../pages/chat-page/components/friends/dialogs/friend-request-dialog.component';
import { LogoutButton } from '../../pages/chat-page/components/logout-button.component';

export function NavUser({ user }: { user: User }) {
  const [friendRequestOpen, setFriendRequestOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isLoggingOutRef = useRef(false);

  const { isMobile } = useSidebar();
  const receivedCount = useFriendStore(state => state.receivedList.length);
  const getAllFriendRequests = useFriendStore(state => state.getAllFriendRequests);
  const logOut = useAuthStore(state => state.logOut);
  const navigate = useNavigate();

  const handleOpenChange = (open: boolean) => {
    if (isLoggingOutRef.current) return;

    setDropdownOpen(open);
  };

  const setLoggingOut = (value: boolean) => {
    setIsLoggingOut(value);
    isLoggingOutRef.current = value;
  };

  const handleLogOut = async () => {
    setLoggingOut(true);

    try {
      await logOut();

      toast.success('Logout successful!');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (e) {
      console.error('Logout error:', e);
      toast.error(getApiErrorMessage(e, 'Logout failed. Please try again.'));
    } finally {
      setLoggingOut(false);
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    getAllFriendRequests();
  }, [getAllFriendRequests]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={handleOpenChange}>
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

              <DropdownMenuItem
                className="cursor-pointer"
                variant="destructive"
                onPointerDown={() => {
                  isLoggingOutRef.current = true;
                }}
              >
                <LogoutButton loading={isLoggingOut} onClick={handleLogOut} />
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
