import { useThemeStore } from '@/stores/use-theme-store';
import { Moon, Sun } from 'lucide-react';

import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const PreferencesForm = () => {
  const { isDark, toggleTheme } = useThemeStore();

  //   các bạn cần handle logic setOnlineStatus
  const [onlineStatus, setOnlineStatus] = useState(false);

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
              className="data-[state=checked]:bg-primary-glow"
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
            checked={onlineStatus}
            onCheckedChange={setOnlineStatus}
            className="data-[state=checked]:bg-primary-glow"
          />
        </div>
      </CardContent>
    </Card>
  );
};
