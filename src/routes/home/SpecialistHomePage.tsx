import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User2Icon } from "lucide-react";
import { Link } from "react-router-dom";


export default function SpecialistHomePage() {


    return (
        <div className="flex flex-col min-h-screen items-center p-[30px] justify-start">

            <div className="flex w-[100%] justify-end mb-[20%]">
                <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                    <Link to="/specialist/home/profile">
                        <User2Icon color="black" />
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-[20px]">
                <Card className="shadow-lg">
                    <Link to="/specialist/home/pending-registers">
                        <CardHeader>
                            <CardTitle className="text-xl">Avaliações Pendentes</CardTitle>
                            <CardDescription>Registros enviados e sem avaliação</CardDescription>
                        </CardHeader>
                    </Link>
                </Card>
            </div>


        </div>
    )


}