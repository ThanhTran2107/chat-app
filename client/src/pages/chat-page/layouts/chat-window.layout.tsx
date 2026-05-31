import { useChatStore } from '@/stores/use-chat-store';
import { ChatWelcomeScreen } from '../components/chat-windows/chat-welcome-screen.component';
import { ChatWindowSkeleton } from '../components/chat-windows/chat-window-skeleton.component';
import { SidebarInset } from '@/components/ui/sidebar';
import { ChatWindowHeader } from '../components/chat-windows/chat-window-header.component';
import { ChatWindowBody } from '../components/chat-windows/chat-window-body.component';
import { MessageInput } from '../components/messages/message-input.component';

export const ChatWindowLayout = () => {
  const { activeConversationId, conversations, messageLoading: loading } = useChatStore();

  const selectedCovo = conversations.find(convo => convo._id === activeConversationId) ?? null;

  if (!selectedCovo) return <ChatWelcomeScreen />;

  if (loading) return <ChatWindowSkeleton />;

  return (
    <SidebarInset className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-sm shadow-md">
      {/*Header */}
      <ChatWindowHeader chat={selectedCovo} />

      {/*Body */}
      <div className="bg-primary-foreground min-h-0 flex-1 overflow-hidden">
        <ChatWindowBody />
      </div>

      {/*Footer */}
      <MessageInput selectedConvo={selectedCovo} />
    </SidebarInset>
  );
};
