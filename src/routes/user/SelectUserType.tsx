import { Link, useNavigate } from "react-router-dom";
import imgTooth from "@/assets/Icon.svg";
import { ToyBackground } from "@/components/ui/toy-background";
import { User, Stethoscope, LogOut } from "lucide-react";
import apiClient from "@/lib/axios";
import { useSWRConfig } from "swr";

export default function SelectUserType() {
    const navigate = useNavigate();
    const { mutate } = useSWRConfig();

    const handleLogout = async () => {
        await apiClient.post("/auth/logout");
        mutate("/user/me", null);
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="w-full h-screen bg-[#A0E7E5] relative">
            <ToyBackground />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
                {/* Logo */}
                <img
                    src={imgTooth}
                    alt="Logo Molar Check"
                    className="w-32 h-32 md:w-40 md:h-40 object-contain mb-6 drop-shadow-lg animate-in fade-in duration-500"
                />

                {/* App Title */}
                <h1
                    className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                    Molar Check
                </h1>

                {/* Subtitle */}
                <p className="text-white text-opacity-90 text-base md:text-lg mb-12 text-center font-medium max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    Escolha como deseja continuar
                </p>

                {/* Selection Cards Container */}
                <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    {/* Patient Card */}
                    <Link to="/user/create" className="block">
                        <button className="w-full bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF8A65] to-[#FFB394] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <User size={32} color="white" strokeWidth={2.5} />
                                </div>
                                <div className="text-left flex-1">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Sou Paciente</h2>
                                    <p className="text-sm text-gray-600">Registrar e acompanhar diagnósticos</p>
                                </div>
                                <div className="text-[#FF8A65] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </Link>

                    {/* Dentist/Specialist Card */}
                    <Link to="/specialist/create" className="block">
                        <button className="w-full bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF8A65] to-[#FFB394] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Stethoscope size={32} color="white" strokeWidth={2.5} />
                                </div>
                                <div className="text-left flex-1">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Sou Dentista</h2>
                                    <p className="text-sm text-gray-600">Avaliar e diagnosticar pacientes</p>
                                </div>
                                <div className="text-[#FF8A65] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    </Link>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-8 flex items-center gap-2 bg-white text-cyan-600 font-bold transition-all animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 hover:bg-gray-50"
                >
                    <LogOut size={20} />
                    Trocar de conta
                </button>
            </div>
        </div>
    );
}