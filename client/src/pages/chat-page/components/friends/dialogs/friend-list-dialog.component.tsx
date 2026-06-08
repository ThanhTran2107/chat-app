import { useChatStore } from '@/stores/use-chat-store';
import { useFriendStore } from '@/stores/use-friend-store';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import { MessageCircleMore, Users } from 'lucide-react';

import { UserAvatar } from '@/pages/chat-page/components/friends/user-avatar.component';

import { Card } from '@/components/ui/card';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const FriendListDialog = ({ onClose }: { onClose?: () => void }) => {
  const { friends } = useFriendStore();
  const { createConversation } = useChatStore();

  const handleAddConversation = async (friendId: string) => {
    await createConversation('direct', [friendId], '');
    onClose?.();
  };

  return (
    <DialogContent className="glass max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl capitalize">
          <MessageCircleMore className="size-5" /> Start a new chat
        </DialogTitle>
      </DialogHeader>

      {/* Friend list content goes here */}
      <div className="space-y-4">
        <h1 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase">Friend list</h1>

        <div className="scrollbar-hidden max-h-60 space-y-3 overflow-y-auto">
          {map(friends, friend => (
            <Card
              key={friend._id}
              onClick={() => handleAddConversation(friend._id)}
              className="transition-smooth hover:shadow-soft glass hover:bg-muted/30 group/friendCard cursor-pointer p-3"
            >
              <div className="flex items-center gap-3">
                {/*avatar*/}
                <div className="relative">
                  <UserAvatar type="sidebar" name={friend.displayName} avatarUrl={friend.avatarUrl} />
                </div>

                {/*info*/}
                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="truncate text-sm font-semibold">{friend.displayName}</h2>
                  <span className="text-muted-foreground text-sm">@{friend.username}</span>
                </div>
              </div>
            </Card>
          ))}

          {isEmpty(friends) && (
            <p className="text-muted-foreground py-8 text-center">
              <Users className="mx-auto mb-3 size-12 opacity-50" />
              Your friend list is empty. Start adding some friends!
            </p>
          )}
        </div>
      </div>
    </DialogContent>
  );
};
