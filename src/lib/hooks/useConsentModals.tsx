/**
 * Hook customizado para gerenciar modais de consentimento (TCLE + Privacy Policy)
 * Encapsula: estados, effects, presignedUrl regeneration e callbacks
 */

import { useState, useCallback, useEffect } from 'react';
import { useConsentDocuments } from './useConsentDocuments';
import type { ConsentDocumentInfo } from '@/types/consent.types';

interface DocumentModal {
	isOpen: boolean;
	isUnlocked: boolean;
	documentId: number | null;
	presignedUrl: string | null;
}

interface UseConsentModalsReturn {
	tcle: DocumentModal;
	privacy: DocumentModal;
	setTcleOpen: (open: boolean) => void;
	setPrivacyOpen: (open: boolean) => void;
	handleTcleAccepted: (accepted: boolean) => ((accepted: boolean) => void);
	handlePrivacyAccepted: (accepted: boolean) => ((accepted: boolean) => void);
	getTcleDocId: () => number | null;
	getPrivacyDocId: () => number | null;
}

export const useConsentModals = (): UseConsentModalsReturn => {
	const { documents: consentDocs, loading: docsLoading, getPresignedUrl } = useConsentDocuments();

	// Estados estruturados por tipo de documento
	const [tcle, setTcle] = useState<DocumentModal>({
		isOpen: false,
		isUnlocked: false,
		documentId: null,
		presignedUrl: null,
	});

	const [privacy, setPrivacy] = useState<DocumentModal>({
		isOpen: false,
		isUnlocked: false,
		documentId: null,
		presignedUrl: null,
	});

	// Carrega IDs dos documentos quando consentDocs carrega
	useEffect(() => {
		if (!docsLoading && consentDocs.length > 0) {
			const tcleDoc = consentDocs.find(d => d.consent_type === 'tcle');
			const privacyDoc = consentDocs.find(d => d.consent_type === 'privacy_policy');

			if (tcleDoc) {
				setTcle(prev => ({ ...prev, documentId: tcleDoc.id }));
			}
			if (privacyDoc) {
				setPrivacy(prev => ({ ...prev, documentId: privacyDoc.id }));
			}
		}
	}, [consentDocs, docsLoading]);

	// Regenera presignedUrl quando TCLE modal abre
	useEffect(() => {
		if (tcle.isOpen && tcle.documentId) {
			const tcleDoc = consentDocs.find(d => d.id === tcle.documentId);
			if (tcleDoc) {
				getPresignedUrl('tcle', tcleDoc.language).then(response => {
					if (response?.presigned_url) {
						setTcle(prev => ({ ...prev, presignedUrl: response.presigned_url }));
					}
				});
			}
		}
	}, [tcle.isOpen, tcle.documentId, consentDocs, getPresignedUrl]);

	// Regenera presignedUrl quando Privacy modal abre
	useEffect(() => {
		if (privacy.isOpen && privacy.documentId) {
			const privacyDoc = consentDocs.find(d => d.id === privacy.documentId);
			if (privacyDoc) {
				getPresignedUrl('privacy_policy', privacyDoc.language).then(response => {
					if (response?.presigned_url) {
						setPrivacy(prev => ({ ...prev, presignedUrl: response.presigned_url }));
					}
				});
			}
		}
	}, [privacy.isOpen, privacy.documentId, consentDocs, getPresignedUrl]);

	const setTcleOpen = (open: boolean) => {
		setTcle(prev => ({ ...prev, isOpen: open }));
	};

	const setPrivacyOpen = (open: boolean) => {
		setPrivacy(prev => ({ ...prev, isOpen: open }));
	};

	const handleTcleAccepted = useCallback(
		(accepted: boolean) => () => {
			if (accepted) {
				setTcle(prev => ({ ...prev, isUnlocked: true, isOpen: false }));
			}
		},
		[]
	);

	const handlePrivacyAccepted = useCallback(
		(accepted: boolean) => () => {
			if (accepted) {
				setPrivacy(prev => ({ ...prev, isUnlocked: true, isOpen: false }));
			}
		},
		[]
	);

	const getTcleDocId = useCallback(() => tcle.documentId, [tcle.documentId]);
	const getPrivacyDocId = useCallback(() => privacy.documentId, [privacy.documentId]);

	return {
		tcle,
		privacy,
		setTcleOpen,
		setPrivacyOpen,
		handleTcleAccepted,
		handlePrivacyAccepted,
		getTcleDocId,
		getPrivacyDocId,
	};
};
