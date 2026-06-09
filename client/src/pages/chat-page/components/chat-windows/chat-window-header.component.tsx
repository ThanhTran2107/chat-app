import { useAuthStore } from '@/stores/use-auth-store';
import { useChatStore } from '@/stores/use-chat-store';
import { useSocketStore } from '@/stores/use-socket-store';
import type { Conversation } from '@/types/chat';
import filter from 'lodash-es/filter';
import isEmpty from 'lodash-es/isEmpty';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { UserAvatar } from '../friends/user-avatar.component';
import { GroupChatAvatar } from '../groups/group-chat-avatar.component';
import { StatusBadge } from '../status-badge.component';

export const ChatWindowHeader = ({ chat }: { chat?: Conversation }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  const { friendPresence, onlineUsers } = useSocketStore();

  let otherUser;

  chat = chat ?? conversations.find(conversation => conversation._id === activeConversationId);

  if (!chat)
    return (
      <header className="sticky top-0 z-10 flex w-full items-center gap-2 px-4 py-2 md:hidden">
        <SidebarTrigger className="text-foreground -ml-1" />
      </header>
    );

  if (chat.type === 'direct') {
    const otherUsers = filter(chat.participants, participant => participant._id !== user?._id);

    otherUser = !isEmpty(otherUsers) ? otherUsers[0] : null;
  }

  const groupName = Array.isArray(chat.group) ? chat.group[0]?.name : chat.group?.name;

  return (
    <header className="bg-background sticky top-0 z-10 flex items-center px-4 py-2">
      <div className="flex w-full items-center gap-2">
        <SidebarTrigger className="text-foreground -ml-1" />

        <Separator
          orientation="vertical"
          className="mr-2 self-center data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
        />

        <div className="flex w-full items-center gap-3 p-2">
          {/* Avatar and name section */}
          <div className="relative">
            {chat.type === 'direct' ? (
              <>
                <UserAvatar
                  type={'sidebar'}
                  name={otherUser?.displayName ?? 'Deleted account'}
                  avatarUrl={otherUser?.avatarUrl || undefined}
                  className={!otherUser?._id ? 'bg-slate-400' : undefined}
                />
                {!otherUser?._id ? null : (
                  <StatusBadge
                    status={
                      friendPresence[otherUser?._id ?? ''] === 'online' ||
                      (friendPresence[otherUser?._id ?? ''] === undefined &&
                        otherUser?.showOnlineStatus !== false &&
                        onlineUsers.includes(otherUser._id))
                        ? 'online'
                        : 'offline'
                    }
                  />
                )}
              </>
            ) : (
              <GroupChatAvatar participants={chat.participants} type="sidebar" />
            )}
          </div>

          {/* Name and status section */}
          <h2 className="text-foreground! font-semibold">
            {chat.type === 'direct' ? (otherUser?.displayName ?? 'Deleted account') : groupName}
          </h2>
        </div>
      </div>
    </header>
  );
};
