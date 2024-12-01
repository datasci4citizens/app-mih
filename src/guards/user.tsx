import { Skeleton } from "@/components/ui/skeleton";
import ErrorPage from "@/lib/components_utils/ErrorPage";
import { useUser } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";
import useSWR from "swr";

export function UserGuard() {

    const data = useUser()

    if (data.role != "responsible")
        return <Navigate to='/' />
    return <Outlet />
}