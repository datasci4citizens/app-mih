import { Button } from "@/components/ui/button";
import { MailIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function SelectUserType() {

    return (

        <div className="flex flex-col min-h-screen items-center justify-center gap-[32px] pt-[100px] pb-[60px] bg-primary">
            <h1 className="font-extrabold text-3xl text-white">MolarCheck</h1>

            <div className="flex flex-col gap-2 w-[40%]">
                <Button className="bg-white hover:bg-white gap-[5px]">
                    <Link to="/user/create" className="text-black font-semibold">Sou Paciente</Link>
                </Button>
                <Button className="bg-white hover:bg-white gap-[5px]">
                    <Link to="/specialist/create" className="text-black font-semibold">Sou Dentista</Link>
                </Button>
            </div>

        </div>

    )

}