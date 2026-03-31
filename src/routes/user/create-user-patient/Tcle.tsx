import { useNavigate } from 'react-router-dom';
import { ToyBackground } from '@/components/ui/toy-background';
import { TcleModal } from '@/components/ui/tcle-modal';
import { FlaskConical, ArrowRight, UserCheck, ShieldCheck, EyeOff, FileText } from 'lucide-react';
import { useState } from 'react';
import { useResearchParticipation } from '@/lib/context/ResearchParticipationContext';

export default function TcleDecision() {
    const navigate = useNavigate();
    const { setParticipatesInResearch } = useResearchParticipation();
    const [showTcleModal, setShowTcleModal] = useState(false);

    function handleParticipate() {
        setParticipatesInResearch(true);
        navigate('/user/create');
    }

    function handleDecline() {
        setParticipatesInResearch(false);
        navigate('/user/create');
    }

    return (
        <div className="w-full min-h-screen bg-[#A0E7E5] relative font-sans overflow-hidden sm:overflow-auto">
            <ToyBackground />

            <div
                className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6"
                style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)', paddingBottom: '1rem' }}
            >
                {/* Premium Card Container */}
                <div className="bg-white/80 backdrop-blur-xl w-full max-w-[420px] rounded-[2.5rem] p-1.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] ring-1 ring-white/60 animate-in fade-in zoom-in-95 duration-700">

                    {/* Inner Content Area */}
                    <div className="bg-white rounded-[2rem] pt-8 pb-5 px-5 sm:px-6 relative overflow-hidden">

                        {/* Decorative background glows */}
                        <div className="absolute -top-[20%] -right-[20%] w-60 h-60 bg-[#A0E7E5] rounded-full mix-blend-multiply filter blur-[60px] opacity-40 animate-pulse" style={{ animationDuration: '6s' }} />
                        <div className="absolute top-[10%] -left-[20%] w-40 h-40 bg-[#FFB394] rounded-full mix-blend-multiply filter blur-[50px] opacity-20" />

                        {/* Floating Icon */}
                        <div className="flex justify-center relative mb-5">
                            <div className="absolute inset-0 bg-[#A0E7E5]/20 blur-xl rounded-full scale-150" />
                            <div className="w-[60px] h-[60px] bg-gradient-to-tr from-[#A0E7E5] to-[#E6FCFB] border-[3px] border-white rounded-[1.25rem] flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(42,157,143,0.3)] relative z-10 ring-1 ring-black/5 transform transition-transform hover:scale-105 duration-300">
                                <FlaskConical size={28} className="text-[#2A9D8F]" strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Header Titles */}
                        <div className="text-center mb-5 relative z-10">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] tracking-tight mb-1.5">
                                Convite à Pesquisa
                            </h1>
                            <p className="text-[#6B7280] text-sm leading-snug max-w-[280px] mx-auto">
                                Ajude a <strong>FOP - Unicamp</strong> a descobrir novos tratamentos para a HMI compartilhando dados anônimos.
                            </p>
                        </div>

                        {/* Premium Feature List */}
                        <div className="space-y-2.5 mb-5 relative z-10">
                            <div className="bg-[#F8FAFC] rounded-[1.25rem] p-3 border border-[#F1F5F9] shadow-sm flex gap-3 items-start hover:border-[#A0E7E5]/50 hover:bg-[#F0FDFD] transition-colors duration-300">
                                <div className="mt-0.5 bg-white p-1 rounded-md shadow-sm text-[#2A9D8F] ring-1 ring-gray-100 flex-shrink-0">
                                    <EyeOff size={16} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#374151] text-[13px] leading-tight mb-0.5">Privacidade Total</h3>
                                    <p className="text-[#6B7280] text-[11px] leading-snug">Dados pessoais cruzados (nome, email) nunca são usados na pesquisa.</p>
                                </div>
                            </div>

                            <div className="bg-[#F8FAFC] rounded-[1.25rem] p-3 border border-[#F1F5F9] shadow-sm flex gap-3 items-start hover:border-[#FFB394]/30 hover:bg-[#FFF5F2] transition-colors duration-300">
                                <div className="mt-0.5 bg-white p-1 rounded-md shadow-sm text-[#FF8A65] ring-1 ring-gray-100 flex-shrink-0">
                                    <ShieldCheck size={16} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#374151] text-[13px] leading-tight mb-0.5">Acesso Garantido</h3>
                                    <p className="text-[#6B7280] text-[11px] leading-snug">Não participar não interfere no seu uso normal do aplicativo.</p>
                                </div>
                            </div>
                        </div>

                        {/* TCLE Link */}
                        <div className="flex justify-center mb-5 relative z-10">
                            <button
                                type="button"
                                onClick={() => setShowTcleModal(true)}
                                className="group flex items-center gap-1.5 text-[11px] font-bold text-[#2A9D8F] bg-[#E6FCFB] py-1.5 px-3.5 rounded-full hover:bg-[#A0E7E5] hover:text-[#1E7369] transition-all duration-300"
                            >
                                <FileText size={12} />
                                <span>Ler Documento Completo</span>
                            </button>
                        </div>

                        {/* Decision Buttons */}
                        <div className="space-y-2.5 relative z-10">
                            {/* Primary Button (Participate) */}
                            <button
                                type="button"
                                onClick={handleParticipate}
                                className="group w-full relative overflow-hidden rounded-[1.125rem] bg-gradient-to-r from-[#FF8A65] to-[#FF9F80] hover:from-[#FF9F80] hover:to-[#FF8A65] text-white p-[2px] shadow-[0_6px_20px_-6px_rgba(255,138,101,0.5)] transition-all duration-300 active:scale-[0.98]"
                            >
                                <div className="bg-transparent rounded-2xl px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform duration-300">
                                            <UserCheck size={18} className="text-white" strokeWidth={2.5} />
                                        </div>
                                        <p className="font-bold text-white text-[14px] tracking-tight">Quero Participar</p>
                                    </div>
                                    <ArrowRight size={18} className="opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            </button>

                            {/* Secondary Button (Decline) */}
                            <button
                                type="button"
                                onClick={handleDecline}
                                className="w-full flex items-center justify-between px-5 py-3 bg-white border-2 border-[#F3F4F6] text-[#6B7280] hover:text-[#374151] hover:border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-[1.125rem] font-bold text-[13px] transition-all duration-300 active:scale-[0.98] group"
                            >
                                <span className="tracking-tight">Não Quero Participar</span>
                                <ArrowRight size={16} className="text-[#9CA3AF] group-hover:text-[#6B7280] transition-colors" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <TcleModal open={showTcleModal} onOpenChange={setShowTcleModal} />
        </div>
    );
}