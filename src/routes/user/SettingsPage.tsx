import { ToyBackground } from "@/components/ui/toy-background";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import apiClient from "@/lib/axios";
import { notifyApiError } from "@/lib/api-error";
import {
    ChevronLeft,
    Download,
    FileText,
    Shield,
    AlertCircle,

    ChevronDown,
    ChevronUp,
    User
} from 'lucide-react';


export default function SettingsPage() {
    const navigate = useNavigate();
    const { data: user } = useSWR('/user/me/');
    const { data: patientsData } = useSWR<any[]>('/api/patients/my/');
    const consent = user?.consent;

    const [isUpdating, setIsUpdating] = useState(false);
    const [showRevokeTcleModal, setShowRevokeTcleModal] = useState(false);
    const [showRevokePrivacyModal, setShowRevokePrivacyModal] = useState(false);
    const [showTaleDropdown, setShowTaleDropdown] = useState(false);


    const handleDownload = async (documentHash: string, defaultFilename: string) => {
        try {
            const resp = await apiClient.get('/auth/consent-documents/presigned-url/', {
                params: { hash: documentHash }
            });
            const url = resp.data.presigned_url;
            const contentType = resp.data.content_type;

            const ext = contentType === 'text/html' ? '.html' : '.pdf';
            const filename = `${defaultFilename}${ext}`;

            // Busca o arquivo diretamente e cria um Blob local para forçar o download no aparelho
            const fileResp = await fetch(url);
            if (!fileResp.ok) throw new Error("Erro ao baixar arquivo do servidor remoto.");
            const blob = await fileResp.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            // Limpa o link local da memória
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            if (import.meta.env.VITE_DEV_MODE === 'true') {
                console.error('Failed to download document', error);
            }
            notifyApiError(error, 'Não foi possível realizar o download do documento.');
        }
    };

    const handleRevokeTcle = async () => {
        if (!consent?.tcle?.document_hash) return;
        setIsUpdating(true);
        try {
            await apiClient.put('/users/', {
                accept_tcle: false,
                tcle_document: { hash: consent.tcle.document_hash }
            });
            await mutate('/user/me/');
            setShowRevokeTcleModal(false);
        } catch (error: any) {
            if (import.meta.env.VITE_DEV_MODE === 'true') {
                console.error('Failed to revoke TCLE', error);
            }
			notifyApiError(error, 'Falha de conexão ao revogar TCLE. Tente novamente.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRevokePrivacy = async () => {
        // Only UI skeleton. Action will be implemented later.
        console.warn('Revoke Privacy Policy clicked. Future action: Account Deletion.');
        setShowRevokePrivacyModal(false);
    };

    return (
        <div className="w-full min-h-screen bg-[#A0E7E5] relative">
            <ToyBackground />
            <div className="relative z-10 flex flex-col min-h-screen" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)', paddingBottom: '3rem' }}>
                {/* Header */}
                <div className="px-6 pb-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/40 hover:bg-white/60 text-gray-700 rounded-full h-12 w-12 border border-white/50 backdrop-blur-md shadow-lg transition-colors flex items-center justify-center"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Configurações
                    </h1>
                </div>

                <div className="flex-1 flex flex-col items-center px-6">
                    <div className="w-full max-w-2xl space-y-6">

                        {/* Research Participation Card */}
                        {/*
                        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A0E7E5] to-[#2A9D8F] flex items-center justify-center flex-shrink-0 shadow-md">
                                    <FlaskConical size={22} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-800 text-base leading-tight">
                                        Participação na pesquisa
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                                        Contribua com dados anônimos para o estudo do HMI na Unicamp.
                                    </p>
                                </div>
                                <Switch
                                    checked={isParticipating}
                                    disabled={isUpdating}
                                    onCheckedChange={(val) => {
                                        if (!val) {
                                            setShowRevokeTcleModal(true);
                                        } else {
                                            // Handling re-activation of research would require signing a new document.
                                            // The flow for re-accepting is not handled in this skeleton.
                                            console.warn("Re-accept research flow not implemented");
                                        }
                                    }}
                                    className="flex-shrink-0 mt-1"
                                />
                            </div>
                        </div>
                        */}

                        {/* Consents History Container */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl space-y-4">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">Termos e Permissões</h2>

                            {/* TCLE Card */}
                            {consent?.tcle?.accepted && (
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-[#f0fdfb] rounded-lg">
                                            <FileText className="text-[#2A9D8F]" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 text-sm">Termo de Consentimento (TCLE)</p>
                                            <p className="text-xs text-gray-500">
                                                Versão: {consent.tcle.document_version} • Aceito em: {new Date(consent.tcle.accepted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-1 border-t border-gray-50 pt-3">
                                        {consent.tcle.document_hash && (
                                            <button
                                                onClick={() => handleDownload(consent.tcle.document_hash, 'TCLE')}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-xl transition-colors"
                                            >
                                                <Download size={14} /> Download
                                            </button>
                                        )}
                                        {/* 
                                        <button 
                                            onClick={() => setShowRevokeTcleModal(true)}
                                            className="flex-1 py-2 px-3 text-red-500 hover:bg-red-50 text-xs font-medium rounded-xl transition-colors"
                                        >
                                            Revogar permissão
                                        </button>
                                        */}
                                    </div>
                                </div>
                            )}

                            {/* Privacy Policy Card */}
                            {consent?.privacy_policy?.accepted && (
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Shield className="text-blue-500" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 text-sm">Política de Privacidade</p>
                                            <p className="text-xs text-gray-500">
                                                Versão: {consent.privacy_policy.document_version} • Aceito em: {new Date(consent.privacy_policy.accepted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-1 border-t border-gray-50 pt-3">
                                        {consent.privacy_policy.document_hash && (
                                            <button
                                                onClick={() => handleDownload(consent.privacy_policy.document_hash, 'Politica_de_Privacidade')}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-xl transition-colors"
                                            >
                                                <Download size={14} /> Download
                                            </button>
                                        )}
                                        {/* 
                                        <button 
                                            onClick={() => setShowRevokePrivacyModal(true)}
                                            className="flex-1 py-2 px-3 text-red-500 hover:bg-red-50 text-xs font-medium rounded-xl transition-colors"
                                        >
                                            Revogar permissão
                                        </button>
                                        */}
                                    </div>
                                </div>
                            )}

                            {/* TALE Accordion Dropdown */}
                            {patientsData && patientsData.some(p => p.tale_accepted) && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                    <button
                                        onClick={() => setShowTaleDropdown(!showTaleDropdown)}
                                        className="p-4 flex items-center justify-between w-full hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 rounded-lg">
                                                <User className="text-purple-500" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">Termo de Assentimento (TALE)</p>
                                                <p className="text-xs text-gray-500">Documentos assinados pelas crianças</p>
                                            </div>
                                        </div>
                                        <div className="text-gray-400">
                                            {showTaleDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </button>

                                    {showTaleDropdown && (
                                        <div className="border-t border-gray-50 p-4 space-y-4 bg-gray-50/50">
                                            {patientsData.filter(p => p.tale_accepted).map(patient => (
                                                <div key={patient.patient_id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-bold text-gray-700 text-sm">{patient.name}</p>
                                                            <p className="text-[10px] text-gray-400">
                                                                Versão: {patient.tale_document_version || 'N/A'} • Aceito em: {patient.tale_accepted_at ? new Date(patient.tale_accepted_at).toLocaleDateString() : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-1">
                                                        {patient.tale_document_hash ? (
                                                            <button
                                                                onClick={() => handleDownload(patient.tale_document_hash, `TALE_${patient.name.replace(/\\s+/g, '_')}`)}
                                                                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 transition-colors"
                                                            >
                                                                <Download size={14} /> Download
                                                            </button>
                                                        ) : (
                                                            <button disabled className="w-full py-2 px-3 bg-gray-100 text-gray-400 text-xs font-medium rounded-lg border border-gray-200 cursor-not-allowed">
                                                                Documento Indisponível
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Revoke TCLE Modal */}
                {showRevokeTcleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 mb-4 text-amber-500">
                                <AlertCircle size={28} />
                                <h2 className="text-xl font-bold text-gray-800">Sair da pesquisa?</h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-6">
                                Ao revogar o termo de consentimento, você deixará de participar da pesquisa da Unicamp. Você ainda poderá usar o aplicativo normalmente para acompanhamento pessoal, porém os dados gerados não serão mais compartilhados com os pesquisadores.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRevokeTcleModal(false)}
                                    className="flex-1 py-3 rounded-2xl bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleRevokeTcle}
                                    disabled={isUpdating}
                                    className="flex-1 py-3 rounded-2xl bg-red-500 font-bold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {isUpdating ? 'Revogando...' : 'Sim, revogar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Revoke Privacy Modal (Skeleton) */}
                {showRevokePrivacyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 mb-4 text-red-500">
                                <AlertCircle size={28} />
                                <h2 className="text-xl font-bold text-gray-800">Cuidado</h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-6">
                                A revogação da Política de Privacidade implica na <span className="font-bold text-red-500">exclusão total da sua conta e anonimização dos dados</span>, pois os dados são essenciais para o funcionamento do sistema.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRevokePrivacyModal(false)}
                                    className="flex-1 py-3 rounded-2xl bg-gray-100 font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleRevokePrivacy}
                                    className="flex-1 py-3 rounded-2xl bg-red-500 font-bold text-white hover:bg-red-600 transition-colors"
                                >
                                    Excluir conta
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
