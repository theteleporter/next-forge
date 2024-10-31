import { auth, currentUser } from '@clerk/nextjs/server';
import { SidebarProvider } from '@repo/design-system/components/ui/sidebar';
import { NotificationsProvider } from '@repo/design-system/providers/notifications';
import { showBetaFeature } from '@repo/feature-flags';
import type { ReactElement, ReactNode } from 'react';
import { PostHogIdentifier } from './components/posthog-identifier';
import { GlobalSidebar } from './components/sidebar';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({
  children,
}: AppLayoutProperties): Promise<ReactElement> => {
  const user = await currentUser();
  const { redirectToSignIn } = await auth();
  const betaFeature = await showBetaFeature();

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <NotificationsProvider userId={user.id}>
      <SidebarProvider>
        <GlobalSidebar>
          {betaFeature && (
            <div className="m-4 rounded-full bg-success p-1.5 text-center text-sm text-success-foreground">
              Beta feature now available
            </div>
          )}
          {children}
        </GlobalSidebar>
        <PostHogIdentifier />
      </SidebarProvider>
    </NotificationsProvider>
  );
};

export default AppLayout;
