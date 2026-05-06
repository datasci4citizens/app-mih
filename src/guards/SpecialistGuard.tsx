import { Button } from "@/components/ui/button";
import { ToyBackground } from "@/components/ui/toy-background";
import { useUser } from "@/hooks/useUser";
import { Navigate, Outlet } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";

export function SpecialistGuard() {
    const data = useUser();
    const { logout, isLoggingOut } = useLogout();

    if (data.role != "specialist")
        return <Navigate to='/' />
    else if (!data.is_allowed) {
        return (
            <div className="w-full h-screen bg-[#A0E7E5] relative">
                <ToyBackground />
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

                    <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500">
                            <span className="text-4xl">⏳</span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                            Conta em Análise
                        </h1>

                        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                            Sua conta de especialista foi criada e está aguardando aprovação dos administradores.
                        </p>

                        <Button
                            onClick={logout}
                            disabled={isLoggingOut}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold h-12 rounded-xl text-lg shadow-md transition-colors"
                        >
                            Voltar para o Login
                        </Button>
                    </div>

                </div>
            </div>
        )

    }

    return <Outlet />
}