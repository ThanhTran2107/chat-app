import type { User } from '@/types/user';
import map from 'lodash-es/map';
import { Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type EditableField = {
  key: keyof Pick<User, 'displayName' | 'username' | 'email' | 'phoneNumber'>;
  label: string;
  type?: string;
};

const PERSONAL_FIELDS: EditableField[] = [
  { key: 'displayName', label: 'Display Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phoneNumber', label: 'Phone Number' },
];

type Props = {
  userInfo: User | null;
};

export const PersonalInfoForm = ({ userInfo }: Props) => {
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {map(PERSONAL_FIELDS, ({ key, label, type }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type={type ?? 'text'}
                value={userInfo[key] ?? ''}
                onChange={() => {}}
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
            value={userInfo.bio ?? ''}
            onChange={() => {}}
            className="glass-light border-border/30 resize-none"
          />
        </div>

        <Button className="bg-gradient-primary mt-4 w-full transition-opacity hover:opacity-90 md:w-auto">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
