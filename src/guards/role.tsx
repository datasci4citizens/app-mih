import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";

export function RoleGuard() {
    const { data, error, isLoading } = useSWR('/user/me')

    if (data.role == null)
        return <Navigate to="/select" />

    return <Outlet />
}