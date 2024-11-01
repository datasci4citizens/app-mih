import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";

export default function PendingRegisters() {

    return (




        <div className="flex flex-col min-h-screen max-h-screen w-[100%] overflow-scroll items-start justify-start ">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="p-[30px] bg-white rounded-t-3xl -mt-16">
                <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to="/specialist/home">
                            <ArrowLeft color="black" />
                        </Link>
                    </Button>

                    <h1 className="text-3xl font-bold">Avaliações</h1>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to="/user/home/profile">
                            <User2Icon color="black" />
                        </Link>
                    </Button>
                </div>

                <h1 className="text-center mb-[32px]">Selecione abaixo um registro para ser avaliado</h1>

                <Card>
                    <CardHeader>
                        <CardContent className="flex flex-col min-h-[500px] max-h-[500px] overflow-y-scroll p-[10px] gap-[10px]">
                            <Card>
                                <CardHeader>
                                    <CardTitle><Link to="/specialist/home/register-diagnostic">Registro 1</Link> </CardTitle>
                                    <CardDescription>Registro da Criança X feito no dia dd/mm/yyyy</CardDescription>
                                </CardHeader>

                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Registro 2</CardTitle>
                                    <CardDescription>Registro da Criança X feito no dia dd/mm/yyyy</CardDescription>
                                </CardHeader>

                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Registro 3</CardTitle>
                                    <CardDescription>Registro da Criança X feito no dia dd/mm/yyyy</CardDescription>
                                </CardHeader>

                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Registro 4</CardTitle>
                                    <CardDescription>Registro da Criança X feito no dia dd/mm/yyyy</CardDescription>
                                </CardHeader>

                            </Card>

                        </CardContent>
                    </CardHeader>

                </Card>
            </div>

        </div>
    )

}