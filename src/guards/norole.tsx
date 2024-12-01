import { useUser } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";

export function NoRoleGuard() {
    const data = useUser()

    if (data.role != null)
        return <Navigate to="/" />

    return <Outlet />
}