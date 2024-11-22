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
import { ArrowLeft, User2Icon } from "lucide-react";
import { useRegistersContext } from "./RegistersControl";

export default function Register() {

    const { register, patient, back } = useRegistersContext();

    return (

        <div className="overflow-scroll max-h-screen">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className=" items-center justify-between pt-[30px] rounded-t-3xl -mt-16 bg-white">

                <div className="w-[100%] mt-2">
                    <div className="flex w-[100%] justify-between items-center px-[30px] mb-10">

                        <Button size={"icon"} onClick={back} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">

                            <ArrowLeft color="black" />

                        </Button>

                        <h1 className="text-3xl font-bold">Registro</h1>

                        <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                            <User2Icon color="black" />
                        </Button>
                    </div>

                    <Card className="w-[100%] p-[20px] border-none shadow-none">

                        <CardDescription>
                            Resgistro criado em: {new Date(register?.start_date || "").toLocaleDateString('pt-BR')}
                        </CardDescription>

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
                                        {patient?.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        Data de nascimento: {new Date(patient?.birthday || "").toLocaleDateString('pt-BR')}
                                    </CardDescription>
                                    <CardDescription>
                                        Registro enviado: {new Date(register?.start_date ? register?.start_date : 0).toLocaleDateString('pt-BR')}
                                    </CardDescription>
                                    <CardDescription>
                                        Dor nos dentes: {register?.painLevel == 0 ? "Não possui" : ""}
                                        {register?.painLevel == 1 ? "Leve" : ""}
                                        {register?.painLevel == 2 ? "Moderada" : ""}
                                        {register?.painLevel == 3 ? "Intensa" : ""}
                                    </CardDescription>
                                    <CardDescription>
                                        Apresenta manchas {register?.stain ? "Sim" : "Não"}
                                    </CardDescription>
                                    <CardDescription>
                                        Tem Sensibilidade {register?.sensitivityField ? "Sim" : "Não"}
                                    </CardDescription>
                                    <CardDescription>
                                        Observações {register?.userObservations}
                                    </CardDescription>

                                </CardContent>
                            </Card>

                            {

                                !register?.diagnosis && (

                                    <h1 className="text-center font-bold text-destructive mt-10">O registro não foi diagnosticado ainda</h1>

                                )

                            }

                            <Accordion type="single" collapsible className="w-full">
                                {

                                    register?.diagnosis && (
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>Diagnóstico</AccordionTrigger>

                                            {
                                                register?.diagnosis !== null ? (
                                                    <AccordionContent>
                                                        {register?.diagnosis == "sugestive" ? "Sugestivo de HMI" : ""}
                                                        {register?.diagnosis == "presence" ? "Presença de HMI" : ""}
                                                        {register?.diagnosis == "absence" ? "Ausência de HMI" : ""}
                                                        {register?.diagnosis == "invalid" ? "Fotos inadequadas para o diagnóstivo, por favor enviar um novo registro" : ""}

                                                    </AccordionContent>
                                                ) : (
                                                    <AccordionContent>
                                                        O registro ainda não foi diagnosticado
                                                    </AccordionContent>
                                                )

                                            }

                                        </AccordionItem>
                                    )

                                }
                                {
                                    register?.specialistObservations && (
                                        <AccordionItem value="item-2">

                                            <AccordionTrigger>Observações do especialista</AccordionTrigger>

                                            <AccordionContent>
                                                {register.specialistObservations}
                                            </AccordionContent>
                                        </AccordionItem>

                                    )

                                }

                            </Accordion>

                        </CardContent>

                    </Card >
                </div>
            </div>
        </div>


    )

}