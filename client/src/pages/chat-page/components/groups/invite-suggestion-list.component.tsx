import type { Friend } from '@/types/user';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';

import { UserAvatar } from '../friends/user-avatar.component';

interface InviteSuggestionListProps {
  filteredFriends: Friend[];
  onSelect: (friend: Friend) => void;
}

export const InviteSuggestionList = ({ filteredFriends, onSelect }: InviteSuggestionListProps) => {
  if (isEmpty(filteredFriends)) return;

  return (
    <div className="beautiful-scrollbar mt-2 max-h-45 divide-y overflow-y-auto rounded-lg border">
      {map(filteredFriends, friend => (
        <div
          key={friend._id}
          className="hover:bg-muted flex cursor-pointer items-center gap-3 p-2 transition"
          onClick={() => onSelect(friend)}
        >
          <UserAvatar type="chat" name={friend.displayName} avatarUrl={friend.avatarUrl} />
          <span className="font-medium">{friend.displayName}</span>
        </div>
      ))}
    </div>
  );
};
