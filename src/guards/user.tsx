import { useUser } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";

export function UserGuard() {

    const data = useUser()

    if (data.role != "responsible")
        return <Navigate to='/' />
    return <Outlet />
}