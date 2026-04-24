import { useState, useEffect } from 'react';
import { differenceInYears } from 'date-fns';
import { useSWRConfig } from 'swr';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';

import { useConsentDocuments } from '@/hooks/useConsentDocuments';
import { DocumentUpdateModalUI, type UpdateModalItem } from '@/components/ui/document-update-modal-ui';
import { TcleModalSecure } from '@/components/ui/tcle-modal-secure';
import { useUser } from '@/hooks/useUser';
import { notifyApiError } from '@/lib/api-error';

interface TaleUpdateGuardProps {
    patientData: any; // Using any for simplicity as it comes from SWR and matches PatientData in the form
    children: React.ReactNode;
}

export function TaleUpdateGuard({ patientData, children }: TaleUpdateGuardProps) {
    const { consent } = useUser();
    const participatesInResearch = consent?.tcle?.accepted ?? false;
    const navigate = useNavigate();

    const [dismissed, setDismissed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

    // Reset dismissed state when patient changes
    useEffect(() => {
        setDismissed(false);
    }, [patientData?.patient_id]);

    // Calc TALE type needed
    const childAge = patientData?.birthday ? differenceInYears(new Date(), new Date(patientData.birthday)) : null;
    const taleType = childAge !== null && childAge >= 6 && childAge <= 9 ? 'tale_6_9'
        : childAge !== null && childAge >= 10 && childAge <= 12 ? 'tale_10_12'
        : null;

    // Load active documents
    const { documents, loading, getPresignedUrl } = useConsentDocuments(taleType ? { type: taleType } : undefined);

    const [presignedUrl, setPresignedUrl] = useState<string | null>(null);

    // Find the active TALE required right now
    const activeDoc = documents.find(d => d.consent_type === taleType);

    // Conditions to show the modal:
    // 1. Participates in research
    // 2. Child is in an age that requires TALE (taleType != null)
    // 3. activeDoc is loaded
    // 4. patientData.tale_document_id does not match the activeDoc.id
    // OR if patientData.tale_document_id is null but they need one
    const needsTaleReconsent = participatesInResearch && taleType && activeDoc && activeDoc.id !== patientData?.tale_document_id;
    const isBlocking = activeDoc?.requires_reconsent ?? false;

    // If modal shown and user dismisses it (and it's non-blocking)
    const shouldShowModal = needsTaleReconsent && !dismissed;

    const { mutate } = useSWRConfig();

    const handleAccept = async () => {
        if (!activeDoc || !patientData?.patient_id) return;
        setSubmitting(true);
        try {
            await apiClient.put(`/api/patients/${patientData.patient_id}/`, {
                tale_document_id: activeDoc.id,
                tale_accepted: true
            });
            // Update successful, refresh the cache for this patient
            await mutate(`/api/patients/${patientData.patient_id}`);
            setDismissed(true);
        } catch (error: any) {
            if (import.meta.env.VITE_DEV_MODE === 'true') {
                console.error("Falha ao aceitar o TALE.", error);
            }
            notifyApiError(error, 'Não foi possível confirmar os dados no servidor. Verifique sua internet.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewDocument = async () => {
        if (!activeDoc) return;
        try {
            const urlData = await getPresignedUrl(activeDoc.consent_type as any);
            setPresignedUrl(urlData?.presigned_url || null);
            setPdfViewerOpen(true);
        } catch (err) {
            if (import.meta.env.VITE_DEV_MODE === 'true') {
                console.error("Failed to fetch URL", err);
            }
            notifyApiError(err, 'Não foi possível carregar o documento agora.');
        }
    };

    if (loading) {
        return <>{children}</>; // while loading conditions, just render children seamlessly or maybe a small loading
    }

    if (shouldShowModal && activeDoc) {
        const item: UpdateModalItem = {
            id: activeDoc.consent_type,
            title: activeDoc.consent_type === 'tale_6_9' ? "TALE (6 a 9 anos)" : "TALE (10 a 12 anos)",
            version: activeDoc.version,
            changelog: activeDoc.changelog || "Este documento é necessário para a participação da criança na pesquisa.",
            onViewDocument: handleViewDocument
        };

        return (
            <>
                {children}
                <DocumentUpdateModalUI
                    items={[item]}
                    isBlocking={isBlocking}
                    submitting={submitting}
                    title="Termo de Assentimento"
                    blockingDescription="Há um Termo de Assentimento pendente. Sua leitura é obrigatória para prosseguir."
                    nonBlockingDescription="Há uma atualização no Termo de Assentimento da criança."
                    acceptButtonTextBlocking="Li e Aceito o Termo"
                    acceptButtonTextNonBlocking="Ler e Aceitar o Termo"
                    onAccept={handleAccept}
                    onDismiss={() => setDismissed(true)}
                    onReject={isBlocking ? () => navigate(-1) : undefined}
                    rejectButtonText="Voltar"
                />

                {/* PDF Viewer */}
                <TcleModalSecure
                    open={pdfViewerOpen}
                    onOpenChange={setPdfViewerOpen}
                    onAccept={() => setPdfViewerOpen(false)}
                    documentType={activeDoc.consent_type as any}
                    presignedUrl={presignedUrl || undefined}
                    isAlreadyUnlocked={true}
                    viewerOnly={true}
                />
            </>
        );
    }

    return <>{children}</>;
}
