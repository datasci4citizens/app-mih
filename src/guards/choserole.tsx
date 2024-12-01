
import { useUser } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";

export function ChoseRoleGuard() {
    const data = useUser();

    if (data.role === "responsible") return <Navigate to="/user/home" />;
    if (data.role === "specialist") return <Navigate to="/specialist/home" />;

    return <Outlet />;
}