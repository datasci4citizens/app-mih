import { useUser } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";

export function RoleGuard() {

    const data = useUser()

    //console.log("role guard ", data)

    if (data.role == null)
        return <Navigate to="/select" />

    return <Outlet />
}