import LoadingInfos from "@/lib/components_utils/LoadingInfos";
import ErrorPage from "@/lib/components_utils/ErrorPage";
import { UserContextProvider } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";
import useSWR from "swr";

export function AuthGuard() {

    const { data, error, isLoading } = useSWR('/user/me')

    if (isLoading)
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

    if (!data || data.detail || typeof data === 'string') {
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log("AuthGuard: Navigating to /login due to invalid data or HTML response.")
        }
        return <Navigate to='/login' />
    }

    return <UserContextProvider value={{ ...data }}>
        <Outlet />
    </UserContextProvider>
}