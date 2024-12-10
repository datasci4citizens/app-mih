import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks/use-user";
import { Link, Navigate, Outlet } from "react-router-dom";

export function SpecialistGuard() {

    const data = useUser();

    if (data.role != "specialist")
        return <Navigate to='/' />
    else if (!data.is_allowed) {
        return (
            <div className="h-screen min-w-full flex flex-col justify-start items-center p-[30px] pt-[100px] bg-primary">

                <div className="flex flex-col justify-between items-center h-[60%]">
                    <h1 className="text-4xl font-bold text-white text-start">Ops! <br /> Parece que você ainda não tem permissão para acessar a área de especialista </h1>

                    <Link to="/specialist/home">
                        <Button variant={"secondary"} className="text-2xl text-primary">
                            Retornar
                        </Button>
                    </Link>

                </div>
            </div>
        )

    }

    return <Outlet />
}