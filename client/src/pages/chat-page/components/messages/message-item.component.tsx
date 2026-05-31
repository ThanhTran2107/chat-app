import type { Conversation, Message, Participant } from '@/types/chat.ts';
import { cn, formatMessageTime } from '@/lib/utils';
import { UserAvatar } from '../friends/user-avatar.component';
import { Card } from 'antd';
import { Badge } from '@/components/ui/badge';

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: 'delivered' | 'seen';
}

export const MessageItem = ({ message, index, messages, selectedConvo, lastMessageStatus }: MessageItemProps) => {
  const prev = messages[index - 1];

  const isGroupBreak =
    index === 0 ||
    message.senderId !== prev?.senderId ||
    new Date(message.createdAt).getTime() - new Date(prev?.createdAt || 0).getTime() > 300000; // 5 minutes

  const participant = selectedConvo.participants.find(
    (participant: Participant) => participant._id.toString() === message.senderId.toString(),
  );

  return (
    <div className={cn('message-bounce flex overflow-hidden', message.isOwn ? 'justify-end' : 'justify-start')}>
      {/*avatar*/}
      {!message.isOwn && (
        <div>
          {isGroupBreak && (
            <UserAvatar
              type="chat"
              name={participant?.displayName ?? 'Moji'}
              avatarUrl={participant?.avatarUrl ?? undefined}
            />
          )}
        </div>
      )}

      {/*message*/}
      <div className={cn('max-w-x flex flex-col space-y-1 lg:max-w-md', message.isOwn ? 'items-end' : 'items-start')}>
        <Card className={cn('p-3', message.isOwn ? 'chat-bubble-sent border-0' : 'chat-bubble-received')}>
          <p className="text-sm leading-relaxed wrap-break-word">{message.content}</p>
        </Card>

        {/*time*/}
        {isGroupBreak && (
          <span className="text-muted-foreground px-1 text-xs">{formatMessageTime(new Date(message.createdAt))}</span>
        )}

        {/*seen delivered*/}
        {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
          <Badge
            variant="outline"
            className={cn(
              'h-4 border-0 px-1.5 py-0.5 text-xs',
              lastMessageStatus === 'seen' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground',
            )}
          >
            {lastMessageStatus}
          </Badge>
        )}
      </div>
    </div>
  );
};
