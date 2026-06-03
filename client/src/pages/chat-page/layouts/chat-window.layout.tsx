import { useChatStore } from '@/stores/use-chat-store';
import { ChatWelcomeScreen } from '../components/chat-windows/chat-welcome-screen.component';
import { ChatWindowSkeleton } from '../components/chat-windows/chat-window-skeleton.component';
import { SidebarInset } from '@/components/ui/sidebar';
import { ChatWindowHeader } from '../components/chat-windows/chat-window-header.component';
import { ChatWindowBody } from '../components/chat-windows/chat-window-body.component';
import { MessageInput } from '../components/messages/message-input.component';
import { useEffect } from 'react';

export const ChatWindowLayout = () => {
  const { activeConversationId, conversations, messageLoading: loading, markAsSeen } = useChatStore();

  const selectedConvo = conversations.find(convo => convo._id === activeConversationId) ?? null;

  useEffect(() => {
    if (!selectedConvo) return;

    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (e) {
        console.error('Mark as seen error:', e);
      }
    };

    markSeen();
  }, [markAsSeen, selectedConvo]);

  if (!selectedConvo) return <ChatWelcomeScreen />;

  if (loading) return <ChatWindowSkeleton />;

  return (
    <SidebarInset className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-sm shadow-md">
      {/*Header */}
      <ChatWindowHeader chat={selectedConvo} />

      {/*Body */}
      <div className="bg-primary-foreground min-h-0 flex-1 overflow-hidden">
        <ChatWindowBody />
      </div>

      {/*Footer */}
      <MessageInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
};
