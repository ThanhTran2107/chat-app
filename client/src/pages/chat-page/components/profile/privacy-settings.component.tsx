import { Bell, Shield, ShieldBan } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const PrivacySettings = () => (
  <Card className="glass-strong border-border/30">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="text-primary h-5 w-5" />
        Privacy & Security
      </CardTitle>
      <CardDescription>Manage your privacy and security settings</CardDescription>
    </CardHeader>

    <CardContent className="space-y-6">
      <div className="space-y-4">
        <Button
          variant="outline"
          className="glass-light border-border/30 hover:text-warning w-full cursor-pointer justify-start"
        >
          <Shield className="mr-2 h-4 w-4" />
          Change Password
        </Button>

        <Button
          variant="outline"
          className="glass-light border-border/30 hover:text-info w-full cursor-pointer justify-start"
        >
          <Bell className="mr-2 h-4 w-4" />
          Notification Settings
        </Button>

        <Button
          variant="outline"
          className="glass-light border-border/30 hover:text-destructive w-full cursor-pointer justify-start"
        >
          <ShieldBan className="mr-2 size-4" />
          Block & Report
        </Button>
      </div>

      <div className="border-border/30 border-t pt-4">
        <h4 className="text-destructive mb-3 font-medium">Danger Zone</h4>
        <Button variant="destructive" className="w-full cursor-pointer">
          Delete Account
        </Button> 
      </div>
    </CardContent>
  </Card>
);
