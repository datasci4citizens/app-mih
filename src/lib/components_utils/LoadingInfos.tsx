import { ToyBackground } from "@/components/ui/toy-background";
import imgTooth from "@/assets/tooth.png";

export default function LoadingInfos() {
    return (
        <div className="min-h-screen w-full bg-[#A0E7E5] relative">
            <ToyBackground />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' }}>
                {/* Logo */}
                <img
                    src={imgTooth}
                    alt="Logo Molar Check"
                    className="w-32 h-32 mb-8 animate-pulse"
                />

                {/* Loading Card */}
                <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl px-8 py-6 shadow-xl">
                    <div className="flex items-center gap-4">
                        {/* Spinner */}
                        <div className="w-8 h-8 border-4 border-white border-t-[#A0E7E5] rounded-full animate-spin"></div>

                        {/* Text */}
                        <p className="text-xl font-bold text-gray-800">Carregando...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}