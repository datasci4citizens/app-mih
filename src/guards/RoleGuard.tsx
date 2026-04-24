import { useUser } from "@/hooks/useUser";
import { Navigate, Outlet } from "react-router-dom";

export function RoleGuard() {

    const data = useUser()

    if (import.meta.env.VITE_DEV_MODE === 'true') {
        console.log("role guard ", data);
    }

    if (data.role == null)
        return <Navigate to="/select" />

    return <Outlet />
}