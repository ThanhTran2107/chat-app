/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFriendStore } from '@/stores/use-friend-store';
import { SentRequestDialog } from './sent-request-dialog.component';
import { ReceivedRequestDialog } from './received-request-dialog.component';

interface FriendRequestDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const FriendRequestDialog = ({ open, setOpen }: FriendRequestDialogProps) => {
  const [tab, setTab] = useState('received');
  const { getAllFriendRequests } = useFriendStore();

  useEffect(() => {
    const loadRequest = async () => {
      try {
        await getAllFriendRequests();
      } catch (e) {
        console.error('Error loading friend requests:', e);
      }
    };

    loadRequest();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Friend requests</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex w-full flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-3 w-full">
            <ReceivedRequestDialog />
          </TabsContent>

          <TabsContent value="sent" className="mt-3 w-full">
            <SentRequestDialog />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
