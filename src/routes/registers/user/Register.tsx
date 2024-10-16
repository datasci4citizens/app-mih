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


export default function Register() {

    return (

        <Card className="overflow-scroll max-h-screen p-[20px] border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-center">
                    Registro "n"
                </CardTitle>
            </CardHeader>

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
                            Criança 1
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Nome
                        </CardDescription>
                        <CardDescription>
                            Idade
                        </CardDescription>
                        <CardDescription>
                            Registro enviado: dd/mm/yyyy
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

    )

}