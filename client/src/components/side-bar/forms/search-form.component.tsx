import { type FieldErrors, type UseFormRegister, type Control, useWatch } from 'react-hook-form';
import type { IFormValues } from '@/pages/chat-page/components/add-friend-model.component.tsx';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spin } from '@/components/antd/spin.component';
import { Search } from 'lucide-react';

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  control: Control<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  isFound: boolean | null;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export const SearchForm = ({
  register,
  control,
  errors,
  loading,
  isFound,
  searchedUsername,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  const usernameValue = useWatch({ control, name: 'username' });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium">
          Find by username
        </Label>

        <Input
          id="username"
          placeholder="Enter username"
          className="glass border-border/50 focus:border-primary/50 transition-smooth mt-2"
          {...register('username', { required: 'Username is required' })}
          disabled={loading}
        />

        {errors.username && <p className="error-message">{errors.username.message}</p>}

        {isFound === false && (
          <span className="error-message">
            No user found with username<span className="font-semibold"> @{searchedUsername}</span>
          </span>
        )}
      </div>

      <DialogFooter>
        <DialogClose>
          <Button type="button" variant="outline" className="glass hover:text-destructive flex-1" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>

        <Button
          type="submit"
          disabled={loading || !usernameValue?.trim()}
          className="bg-gradient-chat transition-smooth flex-1 text-white hover:opacity-90"
        >
          {loading ? (
            <Spin />
          ) : (
            <>
              <Search className="size-4" />
              Search
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};
