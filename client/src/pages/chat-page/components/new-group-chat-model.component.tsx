import { useChatStore } from '@/stores/use-chat-store';
import { useFriendStore } from '@/stores/use-friend-store';
import { type Friend } from '@/types/user';
import filter from 'lodash-es/filter';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import some from 'lodash-es/some';
import { UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';

import { Spin } from '@/components/antd/spin.component';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { getApiErrorMessage } from '@/lib/axios';

import { InviteSuggestionList } from './groups/invite-suggestion-list.component';
import { SelectedUserList } from './groups/selected-user-list.component';

export const NewGroupChatModel = () => {
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<Friend[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { loading, createConversation } = useChatStore();
  const { friends, getFriendList } = useFriendStore();

  const handleGetFriends = async () => {
    await getFriendList();
    setIsOpen(true);
  };

  const handleSelectFriend = (friend: Friend) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearch('');
  };

  const handleRemoveFriend = (friend: Friend) => setInvitedUsers(filter(invitedUsers, user => user._id !== friend._id));

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (isEmpty(invitedUsers)) return toast.warning('Please invite at least one friend to create a group chat.');

      await createConversation(
        'group',
        map(invitedUsers, user => user._id),
        groupName,
      );

      setGroupName('');
      setSearch('');
      setInvitedUsers([]);
      setIsOpen(false);
    } catch (e) {
      console.error('Error creating group conversation:', e);
      toast.error(getApiErrorMessage(e, 'Failed to create group conversation. Please try again.'));
    }
  };

  const filteredFriends = filter(
    friends,
    friend =>
      friend.displayName.toLowerCase().includes(search.toLowerCase()) &&
      !some(invitedUsers, user => user._id === friend._id),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        nativeButton={false}
        render={
          <div className="hover:bg-sidebar-accent z-10 flex size-5 cursor-pointer items-center justify-center rounded-full transition" />
        }
        onClick={handleGetFriends}
      >
        <Users className="size-4" />
        <span className="sr-only">Create Group</span>
      </DialogTrigger>

      <DialogContent className="border-none sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="capitalize">Create a new group chat</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group name input */}
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-semibold">
              Group Name
            </Label>

            <Input
              id="groupName"
              placeholder="Enter group name"
              className="glass border-border/50 focus:border-primary/50 transition-smooth"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              required
            />

            {/* Friend search input */}
            <div className="mt-2 space-y-2">
              <Label htmlFor="invite" className="text-sm font-semibold">
                Invite Friends
              </Label>

              <Input
                id="invite"
                placeholder="Search friends"
                className="glass border-border/50 focus:border-primary/50 transition-smooth"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              {/* invite suggestion list */}
              {search && !isEmpty(filteredFriends) && (
                <InviteSuggestionList filteredFriends={filteredFriends} onSelect={handleSelectFriend} />
              )}

              {/* invited users list */}
              <SelectedUserList invitedUsers={invitedUsers} onRemove={handleRemoveFriend} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-chat transition-smooth flex-1 text-white hover:opacity-90"
            >
              {loading ? (
                <>
                  <Spin />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 size-4" />
                  Create group
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
