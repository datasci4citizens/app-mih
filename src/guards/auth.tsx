import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "@/components/ui/logout-button";
import ErrorPage from "@/lib/components_utils/ErrorPage";
import { UserContextProvider } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";
import useSWR from "swr";

export function AuthGuard() {

    const { data, error, isLoading } = useSWR('/user/me')

    if (isLoading)
        return (
            <div className="min-h-screen relative flex justify-center items-center">
                <div className="z-10 h-[100px] w-[50%] bg-primary text-white border-4 rounded-xl overflow-visible flex items-center justify-center"> <Skeleton className="font-bold text-xl bg-white/0">Carregando</Skeleton>

                </div>
            </div>
        )

    console.log("auth guard data:", data)
    console.log("auth guard typeof data:", typeof data)

    if (error)
        return <ErrorPage type="login"></ErrorPage>

    if (!data || data.detail || typeof data === 'string') {
        console.log("AuthGuard: Navigating to /login due to invalid data or HTML response.")
        return <Navigate to='/login' />
    }

    return <UserContextProvider value={{ ...data }}>
        <LogoutButton />
        <Outlet />
    </UserContextProvider>
}