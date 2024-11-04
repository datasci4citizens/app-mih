import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,

} from "@/components/ui/carousel"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, User2Icon } from "lucide-react";
import { useFormContext } from "./RegistersControl";

export default function Register() {

    const { register, patient, back } = useFormContext();

    return (

        <div className="overflow-scroll max-h-screen">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className=" items-center justify-between pt-[30px] rounded-t-3xl -mt-16 bg-white">

                <div className="w-[100%] mt-2">
                    <div className="flex w-[100%] justify-between items-center px-[30px] mb-10">

                        <Button size={"icon"} onClick={back} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">

                            <ArrowLeft color="black" />

                        </Button>

                        <h1 className="text-3xl font-bold">Registro {register.register}</h1>

                        <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                            <Link to="/user/home/profile">
                                <User2Icon color="black" />
                            </Link>
                        </Button>
                    </div>

                    <Card className="w-[100%] p-[20px] border-none shadow-none">

                        <CardContent className="flex flex-col items-center p-[20px] ">

                            <Carousel className="w-full max-w-[80%]">
                                <CarouselContent>
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <CarouselItem key={index}>
                                            <div className="p-1">
                                                <Card>
                                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                                        <span className="text-4xl font-semibold"> IMAGEM {index + 1}</span>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>


                            <Card className="min-w-[80%]">
                                <CardHeader>
                                    <CardTitle className="text-sm ">
                                        {patient.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        {patient.age}
                                    </CardDescription>
                                    <CardDescription>
                                        Registro enviado: {register.createDate}
                                    </CardDescription>
                                    <CardDescription>
                                        Nivel de dor
                                    </CardDescription>
                                    <CardDescription>
                                        Apresenta manchas
                                    </CardDescription>
                                    <CardDescription>
                                        Tem Sensibilidade
                                    </CardDescription>
                                    <CardDescription>
                                        Observações
                                    </CardDescription>

                                </CardContent>
                            </Card>

                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Diagnóstico</AccordionTrigger>
                                    <AccordionContent>
                                        O registro ainda não foi diagnosticado
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                        </CardContent>

                    </Card >
                </div>
            </div>
        </div>


    )

}