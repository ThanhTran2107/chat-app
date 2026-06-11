import { useAuthStore } from '@/stores/use-auth-store';
import { Spin } from 'antd';
import { Bell, Shield, ShieldBan } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ROUTES } from '@/utils/constants';
import { authService } from '@/utils/services/auth.service';

import { getApiErrorMessage } from '@/lib/axios';

export const PrivacySettings = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const clearState = useAuthStore(state => state.clearState);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      await authService.deleteAccount();

      clearState();
      toast.success('Account deleted successfully.');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (e) {
      console.error('Delete account error:', e);
      toast.error(getApiErrorMessage(e, 'Failed to delete account. Please try again.'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
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
          <Button variant="destructive" className="w-full cursor-pointer" onClick={() => setIsDialogOpen(true)}>
            Delete Account
          </Button>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Delete Account</DialogTitle>
            <p className="text-muted-foreground text-sm">
              Deleting your account will permanently remove your profile, messages, friend data, and other related
              content.
            </p>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <p className="text-foreground">
              This action cannot be undone. Please confirm that you want to permanently delete your account.
            </p>
            <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
              <p className="font-medium">Warning</p>
              <p>Your account, messages, conversations, friend connections, and login data will be removed.</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="w-full cursor-pointer sm:w-auto"
              onClick={() => setIsDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="w-full cursor-pointer sm:w-auto"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spin /> Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
