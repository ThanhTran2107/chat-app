import { useAuthStore } from '@/stores/use-auth-store';
import { useChatStore } from '@/stores/use-chat-store';
import type { Conversation } from '@/types/chat';
import filter from 'lodash-es/filter';
import { ImagePlus, Send } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { EmojiPicker } from './emoji-picker.component';

export const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const [value, setValue] = useState('');

  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();

  if (!user) return;

  const handleSendMessage = async () => {
    if (!value.trim()) return;
    const currentValue = value;
    setValue('');

    try {
      if (selectedConvo.type === 'direct') {
        const participants = selectedConvo.participants;
        const otherUser = filter(participants, participant => participant._id !== user._id)[0];

        await sendDirectMessage(otherUser._id, currentValue);
      } else {
        await sendGroupMessage(selectedConvo._id, currentValue);
      }
    } catch (e) {
      console.error('Send message error:', e);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-backgrounds flex min-h-14 items-center gap-2 p-3">
      <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-smooth">
        <ImagePlus className="size-4" />
      </Button>

      <div className="relative flex-1">
        <Input
          onKeyDown={handleKeyPress}
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Type a message..."
          className="border-border/50 focus:border-primary/50 transition-smooth h-9 resize-none bg-white pr-20"
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 transform items-center gap-1">
          <EmojiPicker onChange={(emoji: string) => setValue(`${value}${emoji}`)} />
        </div>
      </div>

      <Button
        className="bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105"
        disabled={!value.trim()}
        onClick={handleSendMessage}
      >
        <Send className="size-4 text-white" />
      </Button>
    </div>
  );
};
