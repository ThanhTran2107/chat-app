import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button.component';

interface ConversationEmptyStateProps {
  type: 'friend' | 'group';
  onStartNewChat?: () => void;
}

export const ConversationEmptyState = ({ type, onStartNewChat }: ConversationEmptyStateProps) => {
  const isFriend = type === 'friend';

  return (
    <div className="flex h-full min-h-30 flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="bg-gradient-chat flex size-14 items-center justify-center rounded-full">
        <MessageCircle className="size-6 text-white" />
      </div>

      <div>
        <p className="text-foreground text-sm font-semibold">{isFriend ? 'No conversations yet' : 'No groups yet'}</p>
        <p className="text-muted-foreground mt-1 text-xs">
          {isFriend ? 'Add friends to start chatting' : 'Create a group to get started'}
        </p>
      </div>

      {onStartNewChat && (
        <Button variant="link" size="sm" className="text-xs font-medium" onClick={onStartNewChat}>
          {isFriend ? 'Start a new chat' : 'Create a new group'}
        </Button>
      )}
    </div>
  );
};
