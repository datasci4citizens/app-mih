import { LogOut } from "lucide-react";
import { Button } from "./button";
import { useLogout } from "@/hooks/useLogout";

export function LogoutButton() {
    const { logout, isLoggingOut } = useLogout();

    return (
        <Button
            onClick={logout}
            disabled={isLoggingOut}
            size="icon"
            className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 shrink-0"
        >
            <LogOut className="h-6 w-6" color="black" />
        </Button>
    );
}
