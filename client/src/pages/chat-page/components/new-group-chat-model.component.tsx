import { useChatStore } from '@/stores/use-chat-store';
import { useFriendStore } from '@/stores/use-friend-store';
import { type Friend } from '@/types/user.type';
import debounce from 'lodash-es/debounce';
import filter from 'lodash-es/filter';
import includes from 'lodash-es/includes';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import some from 'lodash-es/some';
import { UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

import { useEffect, useRef, useState } from 'react';

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

  const isOpeningRef = useRef(false);
  const debouncedGetFriendsRef = useRef<ReturnType<typeof debounce> | null>(null);

  const loading = useChatStore(state => state.loading);
  const createConversation = useChatStore(state => state.createConversation);
  const friends = useFriendStore(state => state.friends);
  const getFriendList = useFriendStore(state => state.getFriendList);

  const handleGetFriends = () => {
    debouncedGetFriendsRef.current?.();
    isOpeningRef.current = true;
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
      isOpeningRef.current = false;
    } catch (e) {
      console.error('Error creating group conversation:', e);
      toast.error(getApiErrorMessage(e, 'Failed to create group conversation. Please try again.'));
    }
  };

  const filteredFriends = filter(
    friends,
    friend =>
      includes(friend.displayName.toLowerCase(), search.toLowerCase()) &&
      !some(invitedUsers, user => user._id === friend._id),
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      isOpeningRef.current = false;
      debouncedGetFriendsRef.current?.cancel?.();
    }

    setIsOpen(open);
  };

  useEffect(() => {
    debouncedGetFriendsRef.current = debounce(async () => {
      await getFriendList();

      if (isOpeningRef.current) setIsOpen(true);
    }, 200);

    return () => debouncedGetFriendsRef.current?.cancel?.();
  }, [getFriendList]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        nativeButton={false}
        render={
          <div className="hover:bg-sidebar-accent z-10 mr-1 flex size-5 cursor-pointer items-center justify-center rounded-full transition" />
        }
        onClick={handleGetFriends}
      >
        <Users className="size-4" />
        <span className="sr-only">Create Group</span>
      </DialogTrigger>

      <DialogContent className="border-none sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-xl capitalize">Create a new group chat</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group name input */}
          <div className="space-y-3">
            <Label
              htmlFor="groupName"
              className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
            >
              Group Name
            </Label>

            <Input
              id="groupName"
              placeholder="Enter group name"
              className="glass border-border/50 focus:border-primary/50 transition-smooth rounded-xl"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              required
            />
          </div>

          {/* Friend search input */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="invite"
                  className="text-muted-foreground text-xs font-semibold tracking-widest uppercase"
                >
                  Invite Friends
                </Label>

                <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                  Selected {invitedUsers.length}
                </span>
              </div>

              <div className="relative">
                <Input
                  id="invite"
                  placeholder="Search friends"
                  className="glass border-border/50 focus:border-primary/50 transition-smooth rounded-xl"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* selected users list */}
            {invitedUsers.length > 0 && <SelectedUserList invitedUsers={invitedUsers} onRemove={handleRemoveFriend} />}

            {/* invite suggestion list */}
            <InviteSuggestionList filteredFriends={filteredFriends} onSelect={handleSelectFriend} />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-chat transition-smooth flex-1 cursor-pointer rounded-full text-white hover:opacity-90"
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
