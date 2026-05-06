import { useUser } from "@/hooks/useUser";
import { Navigate, Outlet } from "react-router-dom";

export function NoRoleGuard() {
    const data = useUser()

    if (data.role != null)
        return <Navigate to="/" />

    return <Outlet />
}