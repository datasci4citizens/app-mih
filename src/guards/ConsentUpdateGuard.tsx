import { useUser } from '@/lib/hooks/use-user';
import { Outlet } from 'react-router-dom';
import { ConsentUpdateModal } from '@/components/ui/consent-update-modal';
import { useState } from 'react';

export function ConsentUpdateGuard() {
    const user = useUser();
    const [dismissed, setDismissed] = useState(false);
    
    // Safety check just in case user object is empty/loading
    if (!user || user.name === "") {
        return <Outlet />;
    }

    const pendingActions = user.pending_actions || {};
    const hasPending = Object.keys(pendingActions).length > 0;
    
    // Only block completely if any pending action demands explicit re-consent
    const requiresReconsent = Object.values(pendingActions).some((action: any) => action.requires_reconsent);
    
    return (
        <>
            <Outlet />
            {hasPending && !dismissed && (
                <ConsentUpdateModal 
                    pendingActions={pendingActions} 
                    isBlocking={requiresReconsent} 
                    onDismiss={() => setDismissed(true)}
                />
            )}
        </>
    );
}
