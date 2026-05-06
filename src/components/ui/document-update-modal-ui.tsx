import { useState } from 'react';
import { LogOut, FileText, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface UpdateModalItem {
    id: string;
    title: string;
    version: string;
    changelog: string;
    onViewDocument: () => void;
}

export interface DocumentUpdateModalUIProps {
    items: UpdateModalItem[];
    isBlocking: boolean;
    submitting: boolean;
    title?: string;
    blockingDescription?: string;
    nonBlockingDescription?: string;
    acceptButtonTextBlocking?: string;
    acceptButtonTextNonBlocking?: string;
    onAccept: () => void;
    onDismiss?: () => void;
    onReject?: () => void; // usually for logout or going back
    rejectButtonText?: string;
}

export function DocumentUpdateModalUI({
    items,
    isBlocking,
    submitting,
    title = "Atualização de Termos",
    blockingDescription = "Publicamos versões novas de nossos documentos e sua leitura é obrigatória.",
    nonBlockingDescription = "Publicamos atualizações recentes. Veja o que mudou:",
    acceptButtonTextBlocking = "Li e Aceito as Atualizações",
    acceptButtonTextNonBlocking = "Ler e Aceitar as Mudanças",
    onAccept,
    onDismiss,
    onReject,
    rejectButtonText = "Não aceitar e sair"
}: DocumentUpdateModalUIProps) {
    const [viewingChangelog, setViewingChangelog] = useState<string | null>(null);

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4 py-8">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 relative">
                {!isBlocking && onDismiss && (
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
                        {title}
                    </h2>
                    
                    <p className="text-gray-600 mb-6 text-sm">
                        {isBlocking ? blockingDescription : nonBlockingDescription}
                    </p>

                    <div className="space-y-4 mb-6">
                        {items.map((item) => {
                            const isExpanded = viewingChangelog === item.id;

                            return (
                                <div key={item.id} className="border border-gray-100 bg-gray-50 rounded-2xl overflow-hidden">
                                    <button 
                                        onClick={() => setViewingChangelog(isExpanded ? null : item.id)}
                                        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Versão {item.version}</p>
                                        </div>
                                        <div className="text-xs font-medium text-[#2A9D8F]">
                                            {isExpanded ? "Ocultar" : "Ver Mudanças"}
                                        </div>
                                    </button>
                                    
                                    {isExpanded && (
                                        <div className="px-5 pb-5 pt-1 text-sm text-gray-700 bg-white border-t border-gray-100">
                                            <p className="font-medium text-gray-800 mb-2">O que mudou:</p>
                                            <div className="whitespace-pre-wrap text-gray-600 mb-3">
                                                {item.changelog || "Nenhuma nota de atualização fornecida pelo administrador."}
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    item.onViewDocument();
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
                        onClick={onAccept}
                        disabled={submitting}
                        className="w-full bg-[#2A9D8F] hover:bg-[#21867a] text-white py-6 rounded-2xl font-semibold shadow-lg shadow-[#2A9D8F]/20 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            "Processando..."
                        ) : (
                            <>
                                <CheckCircle2 size={20} />
                                {isBlocking ? acceptButtonTextBlocking : acceptButtonTextNonBlocking}
                            </>
                        )}
                    </Button>
                    
                    {isBlocking && onReject && (
                        <button
                            onClick={onReject}
                            disabled={submitting}
                            className="w-full py-4 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} /> {rejectButtonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
