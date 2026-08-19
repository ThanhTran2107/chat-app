import { useChatStore } from '@/stores/use-chat.store';
import { useFriendStore } from '@/stores/use-friend.store';
import filter from 'lodash-es/filter';
import includes from 'lodash-es/includes';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import { Users } from 'lucide-react';

import { useState } from 'react';

import { UserAvatar } from '@/pages/chat-page/components/friends/user-avatar.component';

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.component';
import { Input } from '@/components/ui/input.component';

import { CONVERSATION_TYPES } from '@/utils/constants';

export const FriendListDialog = ({ onClose }: { onClose?: () => void }) => {
  const friends = useFriendStore(state => state.friends);
  const createConversation = useChatStore(state => state.createConversation);
  const [search, setSearch] = useState('');

  const handleAddConversation = async (friendId: string) => {
    await createConversation(CONVERSATION_TYPES.DIRECT, [friendId], '');
    onClose?.();
  };

  const filteredFriends = filter(friends, friend => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return includes(friend.displayName.toLowerCase(), query) || includes(friend.username.toLowerCase(), query);
  });

  return (
    <DialogContent className="border-none sm:max-w-106.25">
      <DialogHeader>
        <DialogTitle className="text-xl capitalize">Start a new chat</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Friend list</h1>
            <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              {filteredFriends.length} results
            </span>
          </div>

          <div className="relative">
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search friends"
              className="glass border-border/50 focus:border-primary/50 transition-smooth rounded-xl"
            />
          </div>
        </div>

        <div className="beautiful-scrollbar border-border/50 max-h-60 overflow-y-auto rounded-xl border p-1">
          <div className="divide-y">
            {map(filteredFriends, friend => (
              <div
                key={friend._id}
                onClick={() => handleAddConversation(friend._id)}
                className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg p-3 transition"
              >
                <UserAvatar type="chat" name={friend.displayName} avatarUrl={friend.avatarUrl} />
                <h2 className="truncate text-sm font-semibold">{friend.displayName}</h2>
              </div>
            ))}

            {isEmpty(friends) && (
              <div className="border-border/50 bg-muted/10 flex flex-col items-center justify-center gap-3 rounded-2xl border p-8 text-center">
                <Users className="mx-auto size-12 opacity-50" />
                <p className="text-muted-foreground">Your friend list is empty. Start adding some friends!</p>
              </div>
            )}

            {!isEmpty(friends) && isEmpty(filteredFriends) && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center">
                <Users className="mx-auto size-12 opacity-50" />
                <p className="text-muted-foreground">No friends found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
