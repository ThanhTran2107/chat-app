import { useAuthStore } from '@/stores/use-auth-store';
import { useThemeStore } from '@/stores/use-theme-store';
import { useUserStore } from '@/stores/use-user-store';
import { Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { getApiErrorMessage } from '@/lib/axios';

export const PreferencesForm = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const updateProfile = useUserStore(state => state.updateProfile);
  const [loading, setLoading] = useState(false);

  const handleOnlineStatusChange = async (value: boolean) => {
    if (!user) return;

    setLoading(true);

    try {
      await updateProfile({ showOnlineStatus: value });
    } catch (e) {
      console.error('Error updating online status preference:', e);
      toast.error(getApiErrorMessage(e, 'Failed to update online status preference. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="glass-strong border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="text-primary h-5 w-5" />
          Application Preferences
        </CardTitle>
        <CardDescription>Personalize your chat experience</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="theme-toggle" className="text-base font-medium">
              Dark Mode
            </Label>
            <p className="text-muted-foreground text-sm">Toggle between light and dark themes</p>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="text-muted-foreground h-4 w-4" />
            <Switch
              id="theme-toggle"
              checked={isDark}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-primary-glow cursor-pointer"
            />
            <Moon className="text-muted-foreground h-4 w-4" />
          </div>
        </div>

        {/* Online Status */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="online-status" className="text-base font-medium">
              Show Online Status
            </Label>
            <p className="text-muted-foreground text-sm">Allow others to see when you are online</p>
          </div>
          <Switch
            id="online-status"
            checked={user.showOnlineStatus ?? true}
            disabled={loading}
            onCheckedChange={handleOnlineStatusChange}
            className="data-[state=checked]:bg-primary-glow cursor-pointer"
          />
        </div>
      </CardContent>
    </Card>
  );
};
