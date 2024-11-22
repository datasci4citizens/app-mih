import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User2Icon } from "lucide-react";
import { Link } from "react-router-dom";


export default function SpecialistHomePage() {


    return (

        <div>

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col min-h-screen items-center p-[30px] justify-start rounded-t-3xl bg-white -mt-16">

                <div className="flex w-[100%] justify-end mt-2 mb-10">
                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <User2Icon color="black" />
                    </Button>
                </div>

                <div className="flex flex-col gap-[20px]">
                    <Card className="shadow-lg">
                        <Link to="/specialist/home/registers-evaluation">
                            <CardHeader>
                                <CardTitle className="text-xl">Avaliações Pendentes</CardTitle>
                                <CardDescription>Registros enviados e sem avaliação</CardDescription>
                            </CardHeader>
                        </Link>
                    </Card>
                </div>


            </div>
        </div>

    )


}