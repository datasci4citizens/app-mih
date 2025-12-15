import apiClient from "@/lib/axios";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { Button } from "./button";

export function LogoutButton() {
    const { mutate } = useSWRConfig();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await apiClient.post("/auth/logout");
        mutate("/user/me", null);
        localStorage.clear();
        navigate("/login");
    };

    return (
        <Button
            onClick={handleLogout}
            size="icon"
            className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 shrink-0"
        >
            <LogOut className="h-6 w-6" color="black" />
        </Button>
    );
}
