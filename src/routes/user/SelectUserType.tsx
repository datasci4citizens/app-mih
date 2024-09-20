import { Button } from "@/components/ui/button";
import { MailIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function SelectUserType() {

    return (

        <div className="flex flex-col min-h-screen items-center justify-between pt-[100px] pb-[60px]">
            <h1 className="font-extrabold text-3xl">APP HMI (DENTE)</h1>

            <div className="flex flex-col gap-2 w-[80%]">
                <Button className="bg-[#0F172A] hover:bg-[#0F172A]/90 gap-[5px]">
                    <MailIcon className="w-[16px]"></MailIcon>
                    <Link to="patient">Sou Paciente</Link>
                </Button>
                <Button className="bg-[#334155] hover:bg-[#334155]/90 gap-[5px]">
                    <MailIcon className="w-[16px]"></MailIcon>
                    <Link to="dentist">Sou Dentista</Link>
                </Button>
            </div>

        </div>

    )

}