import { UserContextProvider } from "@/lib/hooks/use-user";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function AuthGuard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 5000);
    }, [])

    if (loading) {
        return <p>Calmai to carregano </p>
    }

    return <UserContextProvider value={{ name: "Miguel" }}>
        <Outlet />
    </UserContextProvider>
}