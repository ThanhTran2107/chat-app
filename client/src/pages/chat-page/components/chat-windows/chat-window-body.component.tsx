import { useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/use-chat-store';
import { ChatWelcomeScreen } from './chat-welcome-screen.component';
import { MessageItem } from '../messages/message-item.component';
import { isEmpty, map } from 'lodash-es';

export const ChatWindowBody = () => {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const { activeConversationId, messages: allMessages, conversations } = useChatStore();
  
  const selectedConvo = conversations.find(conversation => conversation._id === activeConversationId);
  const lastMessageStatus = !isEmpty(selectedConvo?.seenBy ?? []) ? 'seen' : 'delivered';

  const messages = activeConversationId ? (allMessages[activeConversationId]?.items ?? []) : [];

  useEffect(() => {
    if (!bodyRef.current) return;

    bodyRef.current.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [activeConversationId, messages.length]);

  if (!selectedConvo) return <ChatWelcomeScreen />;

  if (isEmpty(messages))
    // return <div className="text-muted-foreground flex h-full items-center justify-center">Chat is empty</div>;
    return;

  return (
    <div className="bg-primary-foreground flex h-full min-h-0 flex-1 flex-col p-4">
      <div
        ref={bodyRef}
        className="beautiful-scrollbar scrollbar-hidden min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto pb-5"
      >
        {map(messages, (message, index) => (
          <div key={message._id} className="text-foreground px-3 py-2 wrap-break-word">
            <MessageItem
              key={message._id}
              message={message}
              index={index}
              messages={messages}
              selectedConvo={selectedConvo}
              lastMessageStatus={lastMessageStatus}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
