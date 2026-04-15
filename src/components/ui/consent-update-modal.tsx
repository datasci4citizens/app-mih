import { useState } from 'react';
import apiClient from '@/lib/axios';
import { useSWRConfig } from 'swr';
import { LogOut, FileText, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TcleModalSecure } from '@/components/ui/tcle-modal-secure';
import { useConsentModals } from '@/lib/hooks/useConsentModals';

interface PendingAction {
    has_update: boolean;
    changelog: string;
    version: string;
    requires_reconsent: boolean;
    document_hash: string;
}

export function ConsentUpdateModal({ pendingActions, isBlocking, onDismiss }: { pendingActions: Record<string, PendingAction>, isBlocking: boolean, onDismiss: () => void }) {
    const { mutate } = useSWRConfig();
    const navigate = useNavigate();
    const { tcle, privacy, setTcleOpen, setPrivacyOpen } = useConsentModals();
    const [submitting, setSubmitting] = useState(false);
    const [viewingChangelog, setViewingChangelog] = useState<string | null>(null);

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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4 py-8">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 relative">
                {!isBlocking && (
                    <button 
                        onClick={onDismiss} 
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>
                )}
                
                <div className="p-6 md:p-8 overflow-y-auto">
                    <div className="w-16 h-16 bg-[#2A9D8F]/10 rounded-2xl flex items-center justify-center mb-6 mt-2">
                        <FileText className="w-8 h-8 text-[#2A9D8F]" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Atualização de Termos
                    </h2>
                    
                    <p className="text-gray-600 mb-6 text-sm">
                        {isBlocking 
                            ? "Publicamos versões novas de nossos documentos e sua leitura é obrigatória para continuar usando o Molar Check."
                            : "Publicamos atualizações recentes. Veja o que mudou:"}
                    </p>

                    <div className="space-y-4 mb-6">
                        {Object.entries(pendingActions).map(([key, data]) => {
                            const title = key === 'tcle' ? "Termo de Consentimento Livre e Esclarecido" : "Política de Privacidade";
                            const isExpanded = viewingChangelog === key;

                            return (
                                <div key={key} className="border border-gray-100 bg-gray-50 rounded-2xl overflow-hidden">
                                    <button 
                                        onClick={() => setViewingChangelog(isExpanded ? null : key)}
                                        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Versão {data.version}</p>
                                        </div>
                                        <div className="text-xs font-medium text-[#2A9D8F]">
                                            {isExpanded ? "Ocultar" : "Ver Mudanças"}
                                        </div>
                                    </button>
                                    
                                    {isExpanded && (
                                        <div className="px-5 pb-5 pt-1 text-sm text-gray-700 bg-white border-t border-gray-100">
                                            <p className="font-medium text-gray-800 mb-2">O que mudou:</p>
                                            <div className="whitespace-pre-wrap text-gray-600 mb-3">
                                                {data.changelog || "Nenhuma nota de atualização fornecida pelo administrador."}
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (key === 'tcle') setTcleOpen(true);
                                                    if (key === 'privacy_policy') setPrivacyOpen(true);
                                                }}
                                                className="text-xs font-semibold text-[#2A9D8F] hover:text-[#21867a] transition-colors"
                                            >
                                                Visualizar documento completo
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3">
                    <Button
                        onClick={handleAccept}
                        disabled={submitting}
                        className="w-full bg-[#2A9D8F] hover:bg-[#21867a] text-white py-6 rounded-2xl font-semibold shadow-lg shadow-[#2A9D8F]/20 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            "Processando..."
                        ) : (
                            <>
                                <CheckCircle2 size={20} />
                                {isBlocking ? "Li e Aceito as Atualizações" : "Ler e Aceitar as Mudanças"}
                            </>
                        )}
                    </Button>
                    
                    {isBlocking && (
                        <button
                            onClick={handleLogout}
                            disabled={submitting}
                            className="w-full py-4 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} /> Não aceitar e sair
                        </button>
                    )}
                </div>
            </div>

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
        </div>
    );
}
