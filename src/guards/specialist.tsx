import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { useUser } from "@/lib/hooks/use-user";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";

export function SpecialistGuard() {

    const data = useUser();
    const { mutate } = useSWRConfig();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await apiClient.post("/auth/logout");
        mutate("/user/me", null);
        localStorage.clear();
        navigate("/login");
    };

    if (data.role != "specialist")
        return <Navigate to='/' />
    else if (!data.is_allowed) {
        return (
            <div className="h-screen min-w-full flex flex-col justify-start items-center p-[30px] pt-[100px] bg-primary">

                <div className="flex flex-col justify-between items-center h-[60%]">
                    <h1 className="text-4xl font-bold text-white text-start">Ops! <br /> Parece que você ainda não tem permissão para acessar a área de especialista </h1>

                    <Button onClick={handleLogout} variant={"secondary"} className="text-2xl text-primary">
                        Retornar
                    </Button>

                </div>
            </div>
        )

    }

    return <Outlet />
}