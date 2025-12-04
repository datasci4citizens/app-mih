import { useUser } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";

export function RoleGuard() {

    const data = useUser()

    if (data.role == null)
        return <Navigate to="/select" />

    return <Outlet />
}