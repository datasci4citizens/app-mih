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
import { ArrowLeft, User2Icon } from "lucide-react";
import { useSpecialistRegistersContext } from "./SpecialsitRegistersControl";
import useSWR from "swr";
import SkeletonLoading from "../../../lib/components_utils/SkeletonLoading";
import { Textarea } from "@/components/ui/textarea";
import ErrorPage from "@/lib/components_utils/ErrorPage";
import loadingGif from "@/assets/gif loading.gif"

const formSchema = z.object({
    diagnostic: z.string(),
    observations: z.string()
})


export default function RegisterDiagnostic() {

    const { submitting, submitRegister, setDiagnostic, setObservation, register, back } = useSpecialistRegistersContext();

    const { data, error, isLoading } = useSWR(`/mih/${register?.mih_id}`);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            diagnostic: "",
            observations: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        submitRegister();
    }

    if (isLoading)
        <SkeletonLoading />

    if (error)
        return <ErrorPage type="specialist"></ErrorPage>

    return (


        <div className=" min-h-screen max-h-screen w-[100%] overflow-scroll items-start justify-start ">

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <Card className="max-h-screen p-[30px] border-none rounded-t-3xl -mt-16 shadow-none mb-20">

                <div className="flex w-[100%] justify-between items-center mt-2 mb-10">

                    <Button size={"icon"} onClick={back} disabled={submitting} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <ArrowLeft color="black" />
                    </Button>

                    <h1 className="text-3xl font-bold">Avaliações</h1>

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 ">
                        <User2Icon color="black" />
                    </Button>
                </div>

                <CardContent className="flex flex-col items-center p-[20px] ">

                    <Carousel className="w-full max-w-[80%]">
                        <CarouselContent>
                            {Array.from({ length: 3 }).map((_, index) => {

                                const photoKey = `photo_id${index + 1}` as 'photo_id1' | 'photo_id2' | 'photo_id3';

                                if (register)
                                    return (
                                        <CarouselItem key={index} className="min-h-[200px] flex items-center justify-center">
                                            <div className="p-1">
                                                <img src={`https://${import.meta.env.VITE_MINIO_DOMAIN}/${import.meta.env.VITE_MINIO_IMAGES_BUCKET}/${register[photoKey]}.jpg`} />
                                            </div>
                                        </CarouselItem>
                                    )
                                else
                                    return (
                                        <CarouselItem key={index}>
                                            <div className="p-1">
                                                <h1>Error</h1>
                                            </div>
                                        </CarouselItem>
                                    )
                            })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                    <Card className="min-w-full">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Nome: {data?.patient?.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 divide-y-2 divide-primary/20">
                            <CardDescription>
                                Data de nascimento: {new Date(data?.patient?.birthday || "").toLocaleDateString('pt-BR')}
                            </CardDescription>
                            {(data?.patient?.brothersNumber || 0) > 0 &&
                                (
                                    <CardDescription>
                                        Número de irmãos: {data?.patient?.brothersNumber}
                                    </CardDescription>
                                )
                            }
                            <CardDescription>
                                Febre ou infecção até os 3 anos: {data?.patient?.highFever ? "Sim" : "Não"}
                            </CardDescription>
                            <CardDescription>
                                Teve nascimento prematuro: {data?.patient?.premature ? "Sim" : "Não"}
                            </CardDescription>
                            <CardDescription>
                                Teve baixo peso ao nascer: {data?.patient?.lowWeight ? "Sim" : "Não"}
                            </CardDescription>
                            <CardDescription>
                                Tipo de parto: {data?.patient?.deliveryType == "normal" ? "Normal" : "Cesárea"}
                            </CardDescription>
                            {
                                data?.patient?.consultType !== "" &&
                                (
                                    <CardDescription>
                                        Atendimento odontológico: {data?.patient?.consultType == "public" ? "público" : "particular"}
                                    </CardDescription>
                                )
                            }
                            <CardDescription>
                                Dor nos dentes: {data?.painLevel == 0 ? "Não possui" : ""}
                                {data?.painLevel == 1 ? "Leve" : ""}
                                {data?.painLevel == 2 ? "Moderada" : ""}
                                {data?.painLevel == 3 ? "Intensa" : ""}
                            </CardDescription>
                            <CardDescription>
                                Tem sensibilidade nos dentes: {data?.sensitivityField ? "Sim" : "Não"}
                            </CardDescription>
                            <CardDescription>
                                Possui manchas nos dentes: {data?.stain ? "Sim" : "Não"}
                            </CardDescription>
                            <CardDescription>
                                Observações do responsável: <br /> {data?.userObservations}
                            </CardDescription>
                        </CardContent>
                    </Card>


                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 flex flex-col justify-center items-center mt-4">
                            <FormField
                                control={form.control}
                                name="diagnostic"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Diagnóstico</FormLabel>
                                        <Select onValueChange={(e) => {
                                            setDiagnostic(e);
                                            form.setValue("diagnostic", e)

                                        }} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o diagnóstico" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="invalid">Foto inadequada para diagnóstico</SelectItem>
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
                                    <FormItem className="w-full">
                                        <FormLabel>Observações</FormLabel>
                                        <FormControl>
                                            <Textarea  {...field} onChange={(e) => {
                                                setObservation(e.target.value)
                                                form.setValue("observations", e.target.value)
                                            }} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={submitting}>{
                                submitting && (

                                    <><img src={loadingGif} className="h-8"></img>Enviando</>

                                )

                            }
                                {
                                    !submitting && (

                                        <>Enviar Registro</>

                                    )

                                }</Button>
                        </form>
                    </Form>

                </CardContent>

            </Card >



        </div>


    )


}