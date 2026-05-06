import LoadingInfos from "@/components/LoadingInfos";
import ErrorPage from "@/components/ErrorPage";
import { UserContextProvider } from "@/hooks/useUser";
import { Navigate, Outlet } from "react-router-dom";
import useSWR from "swr";

export function AuthGuard() {
    const { data, error, isLoading, isValidating } = useSWR('/user/me/')

    // Se estiver carregando ou validando (e ainda não temos dados), mostramos o loading
    if (isLoading || (isValidating && !data))
        return <LoadingInfos />

    if (import.meta.env.VITE_DEV_MODE === 'true') {
        console.log("auth guard data:", data);
        console.log("auth guard typeof data:", typeof data);
    }

    if (error) {
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log("AuthGuard: Error occurred, showing error page", error);
        }
        return <ErrorPage type="login"></ErrorPage>
    }

    // Se não houver dados ou se houver um detalhe de erro (como 'session_expired')
    if (!data || data.detail || typeof data === 'string') {
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log("AuthGuard: Navigating to /login due to invalid data or HTML response.")
        }
        return <Navigate to='/login' />
    }

    return (
        <UserContextProvider value={{ ...data }}>
            <Outlet />
        </UserContextProvider>
    )
}
