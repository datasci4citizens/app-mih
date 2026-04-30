import apiClient from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { useCallback, useState } from "react";

/**
 * Hook compartilhado para realizar logout de forma segura em toda a aplicação.
 * Garante a limpeza do cache SWR, localStorage e redirecionamento.
 */
export function useLogout() {
    const { mutate } = useSWRConfig();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = useCallback(async () => {
        setIsLoggingOut(true);
        try {
            // Tenta avisar o backend
            await apiClient.post("/auth/logout/");
        } catch (error) {
            // Logamos mas não interrompemos o logout local por erro de rede/sessão
            if (import.meta.env.VITE_DEV_MODE === "true") {
                console.error("Erro ao notificar logout no servidor:", error);
            }
            // notifyApiError(error, "Sua sessão pode já ter expirado. Limpando dados locais...");
        } finally {
            // Sempre limpa os dados locais e redireciona, mesmo se a API falhar
            mutate(() => true, undefined, { revalidate: false });
            localStorage.clear();
            setIsLoggingOut(false);
            navigate("/login");
        }
    }, [mutate, navigate]);

    return { logout, isLoggingOut };
}
