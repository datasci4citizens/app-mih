import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User2Icon } from "lucide-react";
import { Link } from "react-router-dom";

export default function PatientRegisters() {

    return (

        <div>

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className="flex flex-col min-h-screen max-h-screen overflow-scroll items-center justify-between p-[30px] rounded-t-3xl -mt-16 bg-white">

                <div>
                    <div className="flex w-[100%] justify-between items-center my-10">

                        <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                            <Link to="/user/home">
                                <ArrowLeft color="black" />
                            </Link>
                        </Button>

                        <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                            <Link to="/user/home/profile">
                                <User2Icon color="black" />
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">
                                Meus Registros
                            </CardTitle>

                            <CardContent className="flex flex-col min-h-[300px] max-h-[300px] overflow-y-scroll p-[10px] gap-[10px]">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Registro 1</CardTitle>
                                        <CardDescription>Registro da Criança X feito no dia dd/mm/yyyy</CardDescription>
                                        {
                                            true && (

                                                <CardDescription className="font-semibold">Retorno: dd/mm/yyyy</CardDescription>
                                            )
                                        }
                                    </CardHeader>

                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Registro 1</CardTitle>
                                        <CardDescription>Registro da Criança X feito no dia dd/mm/yyyy</CardDescription>
                                    </CardHeader>

                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Registro 1</CardTitle>
                                        <CardDescription>Registro da Criança X feito no dia dd/mm/yyyy</CardDescription>
                                    </CardHeader>

                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Registro 1</CardTitle>
                                        <CardDescription>Registro da Criança X feito no dia dd/mm/yyyy</CardDescription>
                                    </CardHeader>

                                </Card>

                            </CardContent>
                        </CardHeader>

                    </Card>

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
                </div>

                <div className='flex absolute inset-x-0 justify-center bottom-[40px]'>
                    <Button className="w-[300px] text-center" type="submit">
                        <Link to="/user/registers/new-register">Novo Registro</Link>
                    </Button>
                </div>

            </div>
        </div>


    )

}