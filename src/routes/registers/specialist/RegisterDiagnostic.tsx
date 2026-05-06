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
import { ArrowLeft, User, AlertCircle } from "lucide-react";
import { useSpecialistRegistersContext } from "./SpecialistRegistersControl";
import useSWR from "swr";
import SkeletonLoading from "@/components/SkeletonLoading";
import ErrorPage from "@/components/ErrorPage";
import { Textarea } from "@/components/ui/textarea";
import { MinioImage } from "@/components/ui/minio-image";
import loadingGif from "@/assets/gif loading.gif"
import { ToyBackground } from "@/components/ui/toy-background";

const formSchema = z.object({
    diagnostic: z.string(),
    observations: z.string()
})


export default function RegisterDiagnostic() {

    const { submitting, submitRegister, setDiagnostic, setObservation, register, back } = useSpecialistRegistersContext();

    const { data, error, isLoading } = useSWR(`/api/mih/${register?.mih_id}`);
    const { data: patientData, isLoading: patientLoading } = useSWR(data?.patient ? `/api/patients/${data.patient}` : null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            diagnostic: "",
            observations: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        submitRegister();
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log(values)
        }
    }

    if (isLoading || patientLoading)
        return <SkeletonLoading />

    if (error)
        return <ErrorPage type="specialist"></ErrorPage>

    return (
        <div className="w-full bg-[#A0E7E5] min-h-screen relative">
            <ToyBackground />

            <div className="relative z-10 p-6 h-full overflow-y-auto pb-20">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Header */}
                    <div className="flex items-center gap-4" style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}>
                        <Button
                            size="icon"
                            onClick={back}
                            disabled={submitting}
                            className="bg-white/40 hover:bg-white/60 text-gray-700 rounded-full h-12 w-12 border border-white/50 backdrop-blur-md shadow-lg transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </Button>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 drop-shadow-sm">Avaliação do Registro</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Left Column: Images & Patient Info */}
                        <div className="space-y-6">
                            {/* Images Carousel */}
                            <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl rounded-3xl overflow-hidden">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-cyan-600" />
                                        Fotos do Paciente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-2">
                                    <Carousel className="w-full max-w-[90%] mx-auto">
                                        <CarouselContent>
                                            {Array.from({ length: 3 }).map((_, index) => {
                                                const photoKey = `photo_id${index + 1}` as 'photo_id1' | 'photo_id2' | 'photo_id3';

                                                if (register)
                                                    return (
                                                        <CarouselItem key={index} className="flex items-center justify-center p-2">
                                                            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner">
                                                                <MinioImage
                                                                    className="w-full h-full object-contain mix-blend-multiply"
                                                                    imageId={register[photoKey]}
                                                                />
                                                            </div>
                                                        </CarouselItem>
                                                    )
                                                else
                                                    return (
                                                        <CarouselItem key={index}>
                                                            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
                                                                <span className="text-gray-400">Erro ao carregar imagem</span>
                                                            </div>
                                                        </CarouselItem>
                                                    )
                                            })}
                                        </CarouselContent>
                                        <CarouselPrevious className="left-[-10px]" />
                                        <CarouselNext className="right-[-10px]" />
                                    </Carousel>
                                </CardContent>
                            </Card>

                            {/* Patient Info */}
                            <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl rounded-3xl">
                                <CardHeader className="pb-2 bg-cyan-50/50">
                                    <CardTitle className="text-lg font-bold text-cyan-800 flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Dados Clínicos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Nome</span>
                                        <span className="font-bold text-gray-800">{patientData?.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">Nascimento</span>
                                        <span className="font-semibold text-gray-700">{patientData?.birthday ? new Date(patientData.birthday).toLocaleDateString('pt-BR') : ""}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-gray-500 text-xs mb-1">Dor nos dentes</p>
                                            <p className="font-bold text-gray-800">
                                                {data?.painLevel == 0 ? "Não possui" : ""}
                                                {data?.painLevel == 1 ? "Leve" : ""}
                                                {data?.painLevel == 2 ? "Moderada" : ""}
                                                {data?.painLevel == 3 ? "Intensa" : ""}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-gray-500 text-xs mb-1">Sensibilidade</p>
                                            <p className="font-bold text-gray-800">{data?.sensitivityField ? "Sim" : "Não"}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-gray-500 text-xs mb-1">Manchas</p>
                                            <p className="font-bold text-gray-800">{data?.stain ? "Sim" : "Não"}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl">
                                            <p className="text-gray-500 text-xs mb-1">Parto Prematuro</p>
                                            <p className="font-bold text-gray-800">{data?.patient?.premature ? "Sim" : "Não"}</p>
                                        </div>
                                    </div>

                                    {data?.userObservations && (
                                        <div className="mt-4 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                            <p className="text-yellow-800 text-xs font-bold uppercase mb-1">Observações do Responsável</p>
                                            <p className="text-gray-700 italic text-sm">"{data?.userObservations}"</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Diagnostic Form */}
                        <div className="space-y-6">
                            <Card className="bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-3xl h-fit sticky top-6">
                                <CardHeader className="bg-cyan-500 py-6 text-white rounded-t-3xl">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        Emitir Diagnóstico
                                    </CardTitle>
                                    <CardDescription className="text-cyan-100">
                                        Selecione o diagnóstico e adicione observações para o paciente.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 pt-8">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="diagnostic"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="font-bold text-gray-700">Conclusão do Diagnóstico</FormLabel>
                                                        <Select onValueChange={(e) => {
                                                            setDiagnostic(e);
                                                            form.setValue("diagnostic", e)
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:ring-cyan-500 text-gray-700">
                                                                    <SelectValue placeholder="Selecione..." />
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
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="font-bold text-gray-700">Observações Clínicas</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                className="min-h-[150px] rounded-xl bg-gray-50 border-gray-200 focus:ring-cyan-500 resize-none"
                                                                placeholder="Descreva detalhes importantes, recomendações ou orientações para o paciente..."
                                                                {...field}
                                                                onChange={(e) => {
                                                                    setObservation(e.target.value)
                                                                    form.setValue("observations", e.target.value)
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full h-14 text-lg font-bold rounded-xl bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-200 mt-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                {submitting ? (
                                                    <div className="flex items-center gap-2">
                                                        <img src={loadingGif} className="h-6 w-6 brightness-0 invert" alt="loading" />
                                                        <span>Enviando...</span>
                                                    </div>
                                                ) : (
                                                    "Confirmar e Enviar"
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}