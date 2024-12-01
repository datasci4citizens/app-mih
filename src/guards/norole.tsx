import { Navigate, Outlet } from "react-router-dom";
import useSWR from "swr";

export function NoRoleGuard() {
    const { data, error, isLoading } = useSWR('/user/me')

    if (data.role != null)
        return <Navigate to="/" />

    return <Outlet />
}