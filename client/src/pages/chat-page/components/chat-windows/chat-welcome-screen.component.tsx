import { SidebarInset } from '@/components/ui/sidebar';
import { ChatWindowHeader } from './chat-window-header.component';

export const ChatWelcomeScreen = () => {
  return (
    <SidebarInset className="flex h-full w-full bg-transparent">
      <ChatWindowHeader />

      <div className="bg-primary-foreground flex flex-1 items-center justify-center rounded-2xl">
        <div className="text-center">
          <div className="shadow-glow pulse-ring mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-linear-to-r from-violet-700 via-fuchsia-600 to-pink-500">
            <span className="text-5xl">🗯️</span>
          </div>

          <h2 className="mb-2 text-2xl font-bold">
            <span className="bg-linear-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
              Welcome to the Chat!
            </span>
          </h2>

          <p className="text-muted-foreground">Start a conversation by selecting a chat or creating a new one.</p>
        </div>
      </div>
    </SidebarInset>
  );
};
