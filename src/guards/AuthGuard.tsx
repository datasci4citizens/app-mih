import LoadingInfos from "@/components/LoadingInfos";
import ErrorPage from "@/components/ErrorPage";
import { UserContextProvider } from "@/hooks/useUser";
import { Navigate, Outlet } from "react-router-dom";
import useSWR from "swr";

export function AuthGuard() {

    const { data, error, isLoading, isValidating } = useSWR('/user/me/')

    // Wait if it's the first load or if SWR is fetching data but we don't have cache yet
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