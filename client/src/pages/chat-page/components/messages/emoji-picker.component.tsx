import { useThemeStore } from '@/stores/use-theme-store';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { isDark } = useThemeStore();

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <Smile className="size-4" />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={70}
        className="mb-12 border-none bg-transparent p-0 shadow-none ring-0 drop-shadow-none"
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
          theme={isDark ? 'dark' : 'light'}
          emojiSize={24}
        />
      </PopoverContent>
    </Popover>
  );
};
