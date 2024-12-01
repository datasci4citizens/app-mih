import ErrorPage from "@/lib/components_utils/ErrorPage";
import { useUser } from "@/lib/hooks/use-user";
import { Navigate, Outlet } from "react-router-dom";

export function SpecialistGuard() {

    const data = useUser();

    if (data.role != "specialist")
        return <Navigate to='/' />

    return <Outlet />
}