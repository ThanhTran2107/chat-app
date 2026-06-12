import { useAuthStore } from '@/stores/use-auth-store';

import type { Dispatch, SetStateAction } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { PersonalInfoForm } from './personal-info-form.component';
import { PreferencesForm } from './preferences-form.component';
import { PrivacySettings } from './privacy-settings.component';
import { ProfileCard } from './profile-card.component';

interface ProfileDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ProfileDialog = ({ open, setOpen }: ProfileDialogProps) => {
  const { user } = useAuthStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="beautiful-scrollbar max-h-[80vh] w-[50vw]! max-w-none! overflow-y-auto border-0 bg-transparent p-0 shadow-2xl">
        <div className="bg-gradient-glass">
          <div className="mx-auto max-w-4xl p-4">
            {/* heading */}
            <DialogHeader className="mb-6">
              <DialogTitle className="text-foreground text-xl font-bold">Profile & Settings</DialogTitle>
            </DialogHeader>

            <ProfileCard user={user} />

            {/* tabs */}
            <Tabs defaultValue="personal" className="my-4 flex flex-col gap-4">
              <TabsList className="glass-light grid w-full grid-cols-3">
                <TabsTrigger value="personal" className="data-[state=active]:glass-strong cursor-pointer">
                  Personal
                </TabsTrigger>
                <TabsTrigger value="preferences" className="data-[state=active]:glass-strong cursor-pointer">
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="privacy" className="data-[state=active]:glass-strong cursor-pointer">
                  Privacy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-3 flex w-full flex-col gap-4">
                <PersonalInfoForm userInfo={user} />
              </TabsContent>

              <TabsContent value="preferences" className="mt-3 flex w-full flex-col gap-4">
                <PreferencesForm />
              </TabsContent>

              <TabsContent value="privacy" className="mt-3 flex w-full flex-col gap-4">
                <PrivacySettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
