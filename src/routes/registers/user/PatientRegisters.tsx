import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash, User2Icon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function PatientRegisters() {

    const { id } = useParams();

    return (

        <div className="min-h-screen max-h-screen overflow-auto">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col items-center justify-between p-[30px] rounded-t-3xl -mt-16 bg-white gap-[30px]">
                <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to={`/user/home/${id}`}>
                            <ArrowLeft color="black" />
                        </Link>
                    </Button>

                    <h1 className="text-3xl font-bold">Meus Registros</h1>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to="/user/home/profile">
                            <User2Icon color="black" />
                        </Link>
                    </Button>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="font-semibold hover:no-underline">Crianças cadastradas</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-[10px]">
                            <Card>
                                <CardHeader className="py-[10px]">
                                    <CardDescription>Júlia Moreira Cunha de Souza</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader className="py-[10px]">
                                    <CardDescription>Júlia Moreira Cunha de Souza</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader className="py-[10px]">
                                    <CardDescription>Júlia Moreira Cunha de Souza</CardDescription>
                                </CardHeader>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Card className="w-[100%] p-0">

                    <CardContent className="flex flex-col max-h-[450px] overflow-y-scroll p-0 gap-[10px]">

                        <Card className="px-4 py-1 flex items-center justify-between">
                            <Link to={`/user/registers/register/${id}`}>
                                <div>
                                    <CardTitle className="text-lg">Registro 1</CardTitle>
                                    <CardDescription>Criança X</CardDescription>
                                    <CardDescription>dd/mm/yyyy</CardDescription>
                                    {
                                        true && (

                                            <CardDescription className="font-semibold">Diagnóstico: presença</CardDescription>
                                        )
                                    }
                                </div>
                            </Link>

                            <div className="flex gap-2">
                                <Button size={"icon"}>
                                    <Edit></Edit>
                                </Button>
                                <Button size={"icon"}>
                                    <Trash></Trash>
                                </Button>
                            </div>

                        </Card>
                        <Card className="px-4 py-1 flex items-center justify-between">
                            <Link to={`/user/registers/register/${id}`}>
                                <div>
                                    <CardTitle className="text-lg">Registro 2</CardTitle>
                                    <CardDescription>Criança X</CardDescription>
                                    <CardDescription>dd/mm/yyyy</CardDescription>
                                    {
                                        false && (

                                            <CardDescription className="font-semibold">Diagnóstico: presença</CardDescription>
                                        )
                                    }
                                </div>

                            </Link>
                            <div className="flex gap-2">
                                <Button size={"icon"}>
                                    <Edit></Edit>
                                </Button>
                                <Button size={"icon"}>
                                    <Trash></Trash>
                                </Button>
                            </div>

                        </Card>
                        <Card className="px-4 py-1 flex items-center justify-between">
                            <Link to={`/user/registers/register/${id}`}>
                                <div>
                                    <CardTitle className="text-lg">Registro 3</CardTitle>
                                    <CardDescription>Criança X</CardDescription>
                                    <CardDescription>dd/mm/yyyy</CardDescription>
                                    {
                                        true && (

                                            <CardDescription className="font-semibold">Diagnóstico: ausência</CardDescription>
                                        )
                                    }
                                </div>
                            </Link>

                            <div className="flex gap-2">
                                <Button size={"icon"}>
                                    <Edit></Edit>
                                </Button>
                                <Button size={"icon"}>
                                    <Trash></Trash>
                                </Button>
                            </div>

                        </Card>

                    </CardContent>


                </Card>


                <Button className="w-[300px] text-center mt-[20px]" type="submit">
                    <Link to={`/user/registers/new-register/${id}`}>Novo Registro</Link>
                </Button>


            </div>
        </div>


    )

}