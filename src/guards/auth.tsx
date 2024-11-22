import { Skeleton } from "@/components/ui/skeleton";
import { UserContextProvider } from "@/lib/hooks/use-user";
import { DatabaseZapIcon } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useSWR from "swr";

export function AuthGuard() {

    // const { data, error, isLoading } = useSWR('/getusers/me')

    const navigate = useNavigate();

    // if (isLoading)
    //     return (

    //         <div className="min-h-screen relative flex justify-center items-center">
    //             <div className="z-10 h-[100px] w-[50%] bg-primary text-white border-4 rounded-xl overflow-visible flex items-center justify-center"> <Skeleton className="font-bold text-xl bg-white/0">Carregando</Skeleton>

    //             </div>
    //         </div>

    //     )

    // console.log(data)

    // if (!data)
    //     navigate("/")


    return <UserContextProvider value={{ name: "Miguel" }}>
        <Outlet />
    </UserContextProvider>
}