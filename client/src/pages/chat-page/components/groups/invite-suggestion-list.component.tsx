import type { Friend } from '@/types/user';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';

import { UserAvatar } from '../friends/user-avatar.component';

interface InviteSuggestionListProps {
  filteredFriends: Friend[];
  onSelect: (friend: Friend) => void;
}

export const InviteSuggestionList = ({ filteredFriends, onSelect }: InviteSuggestionListProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Suggested</p>
          <p className="text-sm font-semibold">Choose friends to add</p>
        </div>

        <span className="border-border/50 text-muted-foreground rounded-full border px-2.5 py-1 text-xs font-semibold tracking-widest uppercase">
          {filteredFriends.length} results
        </span>
      </div>

      {!isEmpty(filteredFriends) && (
        <div className="beautiful-scrollbar border-border/50 max-h-45 overflow-y-auto rounded-xl border p-1">
          <div className="divide-y">
            {map(filteredFriends, friend => (
              <div
                key={friend._id}
                className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg p-2 transition"
                onClick={() => onSelect(friend)}
              >
                <UserAvatar type="chat" name={friend.displayName} avatarUrl={friend.avatarUrl} />
                <span className="font-medium">{friend.displayName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
