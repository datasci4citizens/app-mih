import { UserContextProvider } from "@/lib/hooks/use-user";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useSWR from "swr";

export function AuthGuard() {
    const [loading, setLoading] = useState(true);
    useSWR('/user/me')

    useEffect(() => {
        setTimeout(() => setLoading(false), 5000);
    }, [])

    return <UserContextProvider value={{ name: "Miguel" }}>
        <Outlet />
    </UserContextProvider>
}