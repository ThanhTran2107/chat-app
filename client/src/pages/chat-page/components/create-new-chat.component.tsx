import { Card } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useFriendStore } from '@/stores/use-friend-store';
import { MessageCircle } from 'lucide-react';
import { FriendListDialog } from './friends/dialogs/friend-list-dialog.component';
import { useState } from 'react';

export const CreateNewChat = () => {
  const { getFriendList } = useFriendStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpenChange = async (open: boolean) => {
    setIsDialogOpen(open);

    if (open) await getFriendList();
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <Card className="glass hover:shadow-soft transition-smooth group/card flex-1 cursor-pointer p-3">
          <DialogTrigger className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-chat transition-bounce flex size-8 items-center justify-center rounded-full group-hover/card:scale-110">
                <MessageCircle className="size-4 text-white" />
              </div>

              <span className="text-sm font-medium capitalize">Start a new chat</span>
            </div>
          </DialogTrigger>
        </Card>

        <FriendListDialog onClose={() => setIsDialogOpen(false)} />
      </Dialog>
    </div>
  );
};
