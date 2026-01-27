import { ToyBackground } from "@/components/ui/toy-background";
import useSWR, { useSWRConfig } from "swr";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import apiClient from "@/lib/axios";
import {
    User,
    Bell,
    LogOut,
    ClipboardList,
    CheckCircle2
} from 'lucide-react';

export default function SpecialistHomePage() {

    const { data: user } = useSWR('/user/me')
    const navigate = useNavigate();
    const { mutate } = useSWRConfig();

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = async () => {
        await apiClient.post("/auth/logout");
        mutate("/user/me", null);
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="w-full bg-[#A0E7E5]">
            <ToyBackground />
            <div className="w-full h-screen relative overflow-y-auto">
                <div className="relative z-10 h-full overflow-y-auto" onClick={() => {
                    if (showUserMenu) setShowUserMenu(false);
                    if (showNotifications) setShowNotifications(false);
                }}>
                    <div className="max-w-screen-lg mx-auto min-h-full grid grid-rows-[auto_1fr_auto]">
                        {/* Header Funcional */}
                        <div className="pb-6 md:pb-10 px-6 flex justify-between items-center" style={{ paddingTop: 'max(env(safe-area-inset-top), 2rem)' }}>
                            <div className="relative">
                                <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => {
                                    e.stopPropagation();
                                    setShowUserMenu(!showUserMenu);
                                    setShowNotifications(false);
                                }}>
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-white/60 transition-colors shadow-lg">
                                        <User size={22} className="md:w-7 md:h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-xs md:text-sm opacity-90 font-medium">Bem-vindo(a),</h2>
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">{user?.name ?? 'Especialista'}!</h1>
                                    </div>
                                </div>

                                {/* User Menu Popover */}
                                {showUserMenu && (
                                    <div className="absolute top-14 left-0 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <button onClick={handleLogout} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-50 text-red-500 transition-colors">
                                            <LogOut size={18} />
                                            <span className="font-medium">Sair</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowNotifications(!showNotifications);
                                        setShowUserMenu(false);
                                    }}
                                    className="w-12 h-12 md:w-14 md:h-14 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/50 text-gray-700 hover:bg-white/60 transition-colors shadow-lg"
                                >
                                    <Bell size={22} className="md:w-7 md:h-7" />
                                </button>

                                {/* Notifications Popover */}
                                {showNotifications && (
                                    <div className="absolute top-14 right-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <h3 className="font-bold text-gray-800 mb-3">Notificações</h3>
                                        <div className="text-center text-gray-400 py-4 text-sm">
                                            Nenhuma notificação nova
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Conteúdo Principal - Centralizado na linha do meio */}
                        <div className="flex flex-col justify-center px-6 pb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">

                                {/* Card Avaliações Pendentes */}
                                <button
                                    onClick={() => navigate('/specialist/home/registers-evaluation')}
                                    className="group relative h-48 md:h-64 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <div className="relative z-10 flex h-full flex-col justify-between items-start text-left">
                                        <div className="rounded-2xl bg-white/20 p-3 text-white backdrop-blur-sm transition-colors group-hover:bg-white/30">
                                            <ClipboardList size={32} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">
                                                Avaliações<br />Pendentes
                                            </h3>
                                            <p className="font-medium text-blue-100">
                                                Registros aguardando diagnóstico
                                            </p>
                                        </div>
                                    </div>

                                    {/* Decorative Icon */}
                                    <div className="absolute -right-6 -bottom-6 opacity-20 rotate-[-12deg] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
                                        <ClipboardList size={180} color="white" />
                                    </div>
                                </button>

                                {/* Card Placeholder / Futuro (Histórico) */}
                                <div className="group relative h-48 md:h-64 w-full overflow-hidden rounded-3xl bg-white p-6 shadow-lg transition-all hover:shadow-xl opacity-80 cursor-not-allowed">
                                    <div className="relative z-10 flex h-full flex-col justify-between items-start text-left">
                                        <div className="rounded-2xl bg-green-100 p-3 text-green-600 transition-colors">
                                            <CheckCircle2 size={32} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-1">
                                                Histórico<br />Completo
                                            </h3>
                                            <p className="font-medium text-gray-400">
                                                Em breve
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Elemento Fantasma - Mesma altura do header para balancear o layout */}
                        <div className="pb-6 md:pb-10" style={{ paddingTop: 'max(env(safe-area-inset-top), 2rem)' }} aria-hidden="true"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}