import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

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

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, User2Icon } from "lucide-react";
import { useSpecialistRegistersContext } from "./SpecialsitRegistersControl";
import useSWR from "swr";
import SkeletonLoading from "../user/SkeletonLoading";

const formSchema = z.object({
    diagnostic: z.string(),
    observations: z.string()
})

export default function RegisterDiagnostic() {

    const { setDiagnostic, register, back } = useSpecialistRegistersContext();

    const { data, error, isLoading } = useSWR("http://127.0.0.1:8000/patients/10/mih");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            diagnostic: "",
            observations: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    if (isLoading)
        <SkeletonLoading />

    console.log(data)

    return (


        <div className=" min-h-screen max-h-screen w-[100%] overflow-scroll items-start justify-start ">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <Card className="max-h-screen p-[30px] border-none rounded-t-3xl -mt-16 shadow-none">

                <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                    <Button size={"icon"} onClick={back} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <ArrowLeft color="black" />
                    </Button>

                    <h1 className="text-3xl font-bold">Avaliações</h1>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <Link to="/user/home/profile">
                            <User2Icon color="black" />
                        </Link>
                    </Button>
                </div>

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

                    <Card className="min-w-[85%]">
                        <CardHeader>
                            <CardTitle className="text-sm ">
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 flex flex-col justify-center items-center mt-4">
                            <FormField
                                control={form.control}
                                name="diagnostic"
                                render={({ field }) => (
                                    <FormItem className="w-[300px]">
                                        <FormLabel>Diagnóstico</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o diagnóstico" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="o">Foto inadequada para diagnóstico</SelectItem>
                                                <SelectItem value="sugestive">Sugestivo de HMI</SelectItem>
                                                <SelectItem value="presence">Presença de HMI</SelectItem>
                                                <SelectItem value="absence">Ausência de HMI</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="observations"
                                render={({ field }) => (
                                    <FormItem className="w-[300px]">
                                        <FormLabel>Observações</FormLabel>
                                        <FormControl>
                                            <Input  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Enviar</Button>
                        </form>
                    </Form>

                </CardContent>

            </Card >



        </div>


    )


}