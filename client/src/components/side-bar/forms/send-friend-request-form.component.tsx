import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { IFormValues } from '@/pages/chat-page/components/add-friend-model.component.tsx';
import TextArea from 'antd/es/input/TextArea';
import { UserPlus } from 'lucide-react';
import { type Control, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Spin } from '@/components/antd/spin.component';

interface SendFriendRequestFormProps {
  control: Control<IFormValues>;
  loading: boolean;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

export const SendFriendRequestForm = ({
  control,
  loading,
  searchedUsername,
  onSubmit,
  onBack,
}: SendFriendRequestFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <span className="success-message">
          Great news! We found <span className="font-semibold">@{searchedUsername}</span>
        </span>

        <div className="mt-2 space-y-2">
          <Label className="text-sm font-semibold" htmlFor="message">
            Introduction
          </Label>

          <Controller
            control={control}
            name="message"
            render={({ field }) => (
              <TextArea
                id="message"
                rows={3}
                placeholder="Hi there! Would you like to connect?"
                className="glass border-border/50 focus:border-primary/50 transition-smooth resize-none"
                {...field}
              />
            )}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="glass hover:text-destructive flex-1 cursor-pointer"
            onClick={onBack}
          >
            Back
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-chat transition-smooth flex-1 cursor-pointer text-white hover:opacity-90"
          >
            {loading ? (
              <Spin />
            ) : (
              <>
                <UserPlus className="size-4" /> Add friend
              </>
            )}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
};
