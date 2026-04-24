import { useUser } from "@/hooks/useUser";
import { Navigate, Outlet } from "react-router-dom";

export function UserGuard() {

    const data = useUser()

    if (data.role != "responsible")
        return <Navigate to='/' />
    return <Outlet />
}