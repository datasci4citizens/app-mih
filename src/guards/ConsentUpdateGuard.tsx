import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import apiClient from '@/lib/axios';

import { useUser } from '@/lib/hooks/use-user';
import { useConsentModals } from '@/lib/hooks/useConsentModals';
import { DocumentUpdateModalUI } from '@/components/ui/document-update-modal-ui';
import { TcleModalSecure } from '@/components/ui/tcle-modal-secure';

export function ConsentUpdateGuard() {
    const user = useUser();
    const [dismissed, setDismissed] = useState(false);
    
    const [submitting, setSubmitting] = useState(false);
    const { mutate } = useSWRConfig();
    const navigate = useNavigate();
    const { tcle, privacy, setTcleOpen, setPrivacyOpen } = useConsentModals();

    // Safety check just in case user object is empty/loading
    if (!user || user.name === "") {
        return <Outlet />;
    }

    const pendingActions = user.pending_actions || {};
    const hasPending = Object.keys(pendingActions).length > 0;
    
    // Only block completely if any pending action demands explicit re-consent
    const requiresReconsent = Object.values(pendingActions).some((action: any) => action.requires_reconsent);
    
    const handleAccept = async () => {
        setSubmitting(true);
        try {
            const payload: any = {};
            
            // Revalida a assinatura para as novas versões para que saiam do "pending_actions"
            if (pendingActions.tcle) {
                payload.accept_tcle = true;
                payload.tcle_document = { hash: pendingActions.tcle.document_hash };
            }
            if (pendingActions.privacy_policy) {
                payload.accept_privacy_policy = true;
                payload.privacy_policy_document = { hash: pendingActions.privacy_policy.document_hash };
            }

            await apiClient.put('/users/', payload);
            
            // Recarrega o state do usuário silenciando a notificação
            await mutate('/user/me/');
        } catch (error) {
            console.error("Falha ao aceitar os novos termos.", error);
            alert("Não foi possível confirmar os dados no servidor. Verifique sua internet.");
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <>
            <Outlet />
            {hasPending && !dismissed && (
                <>
                    <DocumentUpdateModalUI
                        items={Object.entries(pendingActions).map(([key, data]: [string, any]) => ({
                            id: key,
                            title: key === 'tcle' ? "Termo de Consentimento Livre e Esclarecido" : "Política de Privacidade",
                            version: data.version,
                            changelog: data.changelog,
                            onViewDocument: () => {
                                if (key === 'tcle') setTcleOpen(true);
                                if (key === 'privacy_policy') setPrivacyOpen(true);
                            }
                        }))}
                        isBlocking={requiresReconsent}
                        submitting={submitting}
                        onAccept={handleAccept}
                        onDismiss={() => setDismissed(true)}
                        onReject={handleLogout}
                    />

                    {/* Visualizadores de PDF nativos */}
                    <TcleModalSecure
                        open={tcle.isOpen}
                        onOpenChange={setTcleOpen}
                        onAccept={() => setTcleOpen(false)}
                        documentType="tcle"
                        presignedUrl={tcle.presignedUrl || undefined}
                        isAlreadyUnlocked={true}
                        viewerOnly={true}
                    />

                    <TcleModalSecure
                        open={privacy.isOpen}
                        onOpenChange={setPrivacyOpen}
                        onAccept={() => setPrivacyOpen(false)}
                        documentType="privacy"
                        presignedUrl={privacy.presignedUrl || undefined}
                        isAlreadyUnlocked={true}
                        viewerOnly={true}
                    />
                </>
            )}
        </>
    );
}
