import { Link } from "react-router-dom";
import { ToyBackground } from "@/components/ui/toy-background";
import { AlertCircle } from "lucide-react";

export default function ErrorPage({ type }: { type: string }) {
    return (
        <div className="w-full h-screen bg-[#A0E7E5] relative">
            <ToyBackground />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
                {/* Error Icon Container */}
                <div className="mb-6 bg-white p-6 rounded-3xl shadow-xl animate-in fade-in duration-500">
                    <AlertCircle size={64} className="text-[#FF8A65]" strokeWidth={2} />
                </div>

                {/* Error Message Card */}
                <div className="w-full max-w-lg bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Ops!
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Parece que algo deu errado...
                        </p>
                        <p className="text-sm text-gray-500">
                            Não se preocupe, você pode retornar à página anterior e tentar novamente.
                        </p>
                    </div>

                    {/* Return Button */}
                    <div className="pt-4">
                        {type === "specialist" && (
                            <Link to="/specialist/home">
                                <button className="w-full transform transition-all duration-150 active:scale-95 hover:-translate-y-1 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-[0_1px_0_rgba(0,0,0,0.1)] active:translate-y-1 rounded-2xl py-4 px-6 font-bold text-white bg-gradient-to-br from-[#FF8A65] to-[#FFB394]">
                                    <span className="text-lg font-semibold">Retornar</span>
                                </button>
                            </Link>
                        )}
                        {type === "user" && (
                            <Link to="/user/home">
                                <button className="w-full transform transition-all duration-150 active:scale-95 hover:-translate-y-1 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-[0_1px_0_rgba(0,0,0,0.1)] active:translate-y-1 rounded-2xl py-4 px-6 font-bold text-white bg-gradient-to-br from-[#FF8A65] to-[#FFB394]">
                                    <span className="text-lg font-semibold">Retornar</span>
                                </button>
                            </Link>
                        )}
                        {type === "login" && (
                            <Link to="/login">
                                <button className="w-full transform transition-all duration-150 active:scale-95 hover:-translate-y-1 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-[0_1px_0_rgba(0,0,0,0.1)] active:translate-y-1 rounded-2xl py-4 px-6 font-bold text-white bg-gradient-to-br from-[#FF8A65] to-[#FFB394]">
                                    <span className="text-lg font-semibold">Retornar</span>
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}