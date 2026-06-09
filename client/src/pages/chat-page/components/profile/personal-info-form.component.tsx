import { useUserStore } from '@/stores/use-user-store';
import type { User } from '@/types/user';
import { Spin } from 'antd';
import map from 'lodash-es/map';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { getApiErrorMessage } from '@/lib/axios';

type FormState = {
  displayName: string;
  username: string;
  email: string;
  phoneNumber: string;
  bio: string;
};

type Props = {
  userInfo: User | null;
};

type EditableField = {
  key: keyof Pick<User, 'displayName' | 'username' | 'email' | 'phoneNumber'>;
  label: string;
  type?: string;
  placeholder?: string;
};

const PERSONAL_FIELDS: EditableField[] = [
  {
    key: 'displayName',
    label: 'Display name',
    placeholder: 'Enter your display name',
  },
  {
    key: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
  },
  {
    key: 'phoneNumber',
    label: 'Phone number',
    placeholder: 'Enter your phone number',
  },
];

export const PersonalInfoForm = ({ userInfo }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    displayName: userInfo?.displayName ?? '',
    username: userInfo?.username ?? '',
    email: userInfo?.email ?? '',
    phoneNumber: userInfo?.phoneNumber ?? '',
    bio: userInfo?.bio ?? '',
  });

  const updateProfile = useUserStore(state => state.updateProfile);

  const handleFieldChange = (field: keyof FormState, value: string) =>
    setFormState(prevState => ({
      ...prevState,
      [field]: value,
    }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      await updateProfile(formState);
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Failed to update profile. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <Card className="glass-strong border-border/30">
      <CardHeader className="mb-4">
        <CardTitle className="flex items-center gap-2">
          <Heart className="text-primary size-5" />
          Personal Information
        </CardTitle>
        <CardDescription>Update your personal details and profile information</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {map(PERSONAL_FIELDS, ({ key, label, type, placeholder }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type={type ?? 'text'}
                  value={formState[key]}
                  placeholder={placeholder}
                  onChange={e => handleFieldChange(key, e.target.value)}
                  className="glass-light border-border/30"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              value={formState.bio}
              placeholder="Tell us a bit about yourself"
              onChange={e => handleFieldChange('bio', e.target.value)}
              className="glass-light border-border/30 resize-none"
            />
          </div>

          <Button
            type="submit"
            className="bg-gradient-primary mt-4 w-full cursor-pointer transition-opacity hover:opacity-90 md:w-auto"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spin /> Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
