import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { isAfter, isBefore, startOfDay } from 'date-fns'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from '@/components/ui/card'
import { ToggleField } from '@/components/ui/toggle-field'

import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from "lucide-react"
import { ToyBackground } from "@/components/ui/toy-background"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select.tsx'
import useSWRMutation from 'swr/mutation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import ErrorPage from '@/lib/components_utils/ErrorPage'
import { useState } from 'react'
import DatePicker from '@/components/ui/date-picker'
import apiClient from '@/lib/axios'


const deliveryProblems = [
    {
        id: "anemia",
        label: "Anemia",
    },
    {
        id: "preeclampsia",
        label: "Pré-eclâmpsia",
    },
    {
        id: "hipertension",
        label: "Hipertensão",
    },
] as const

const formSchema = z.object({
    name: z.string().min(4, {
        message: "Nome muito pequeno.",
    }),
    birthday: z.date(),
    highFever: z.boolean(),
    premature: z.boolean(),
    deliveryProblems: z.boolean(),
    deliveryProblemsTypes: z.array(z.string()),
    lowWeight: z.boolean(),
    deliveryType: z.enum(["cesarean", "normal"]),
    brothers: z.boolean(),
    brothersNumber: z.string(),
    consultDentist: z.boolean(),
    consultType: z.enum(["public", "private", ""])
}).superRefine((values, ctx) => {
    if (values.deliveryProblems && values.deliveryProblemsTypes.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['deliveryProblemsTypes'],
            message: "Você deve selecionar pelo menos um problema",
        });
    }
    if (Number(values.brothersNumber) <= 0 && values.brothers) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['brothersNumber'],
            message: "Pelo menos 1 irmão",
        });
    }
});

async function sendRequest(url: string, { arg }: { arg: any }) {
    return await apiClient.post(url, arg)
}

export default function PatientForm() {

    const { trigger, data, error } = useSWRMutation(`/api/patients/`, sendRequest)
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            birthday: new Date(),
            highFever: false,
            premature: false,
            deliveryProblems: false,
            lowWeight: false,
            deliveryType: "normal",
            deliveryProblemsTypes: [],
            brothers: false,
            brothersNumber: "",
            consultDentist: false,
            consultType: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setSubmitting(true)
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log('=== new values ===')
            console.log(values)
        }

        const newValue = {
            name: values.name,
            birthday: values.birthday,
            highFever: values.highFever,
            premature: values.premature,
            deliveryProblems: values.deliveryProblems,
            lowWeight: values.lowWeight,
            deliveryType: values.deliveryType,
            deliveryProblemsTypes: values.deliveryProblemsTypes.join(" "),
            brothersNumber: Number(values.brothersNumber),
            consultType: values.consultType
        }
        const result = await trigger(newValue)

        if (error) {
            return <ErrorPage type="user"></ErrorPage>
        }

        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log(data);
        }
        if (result && !error) {
            setSubmitting(false)
            navigate(`/user/registers/create-register/${result.data.id}/first_time`);
        } else {
            setSubmitting(false)
            if (import.meta.env.VITE_DEV_MODE === 'true') {
                console.error('Erro ao enviar dados:', error);
            }
        }
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log('=== result ===')
            console.log(result)
        }
    }

    return (
        <div className="min-h-screen h-full relative bg-[#A0E7E5]">
            <ToyBackground />

            <div className="min-h-screen h-full flex flex-col relative z-10">

                {/* Header */}
                <div className="px-6 pb-4 flex items-center gap-4" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:bg-gray-100/50 p-2 rounded-lg transition-colors"
                        disabled={submitting}
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Cadastro da Criança</h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="min-h-full p-6 pb-20">
                        <div className="w-full max-w-md md:max-w-4xl mx-auto">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <Card className='bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-3xl'>
                                        <CardContent className='space-y-3 p-4'>

                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className='font-bold'>Nome completo da criança*</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Nome da criança" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="birthday"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Data de nascimento*</FormLabel>
                                                        <DatePicker
                                                            field={field}
                                                            disabled={(date) => {
                                                                const today = startOfDay(new Date());
                                                                return (isBefore(date, new Date("1900-01-01")) || isAfter(date, today));
                                                                // isAfter(date, subYears(today, 18))
                                                            }}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="brothers"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ToggleField
                                                                label="Tem irmãos?"
                                                                value={field.value}
                                                                onChange={(checked) => {
                                                                    field.onChange(checked);
                                                                    if (!checked) {
                                                                        form.setValue("brothersNumber", "");
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            {form.watch('brothers') && (
                                                <FormField
                                                    control={form.control}
                                                    name="brothersNumber"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='font-bold'>Número de irmãos</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Número de irmãos" {...field} />

                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card className='bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-3xl'>
                                        <CardContent className='space-y-3 p-4'>
                                            <FormField
                                                control={form.control}
                                                name="deliveryProblems"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ToggleField
                                                                label="A mãe teve problemas durante a gravidez?"
                                                                value={field.value}
                                                                onChange={(checked) => {
                                                                    field.onChange(checked);
                                                                    if (!checked) {
                                                                        form.setValue("deliveryProblemsTypes", []);
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            {form.watch('deliveryProblems') && (<FormField
                                                control={form.control}
                                                name="deliveryProblemsTypes"
                                                render={() => (
                                                    <FormItem >

                                                        <Accordion type="single" collapsible className="border-none">
                                                            <AccordionItem value="item-1" className="border-none">
                                                                <AccordionTrigger className='hover:no-underline text-sm font-semibold text-gray-600 py-3 px-4 bg-gray-50 rounded-xl mb-2'>Quais problemas?</AccordionTrigger>
                                                                <AccordionContent className='space-y-3 pt-2 pb-1'>

                                                                    {deliveryProblems.map((item) => (
                                                                        <FormField
                                                                            key={item.id}
                                                                            control={form.control}
                                                                            name="deliveryProblemsTypes"
                                                                            render={({ field }) => {
                                                                                return (

                                                                                    <FormItem
                                                                                        key={item.id}
                                                                                        className="flex flex-row items-center space-x-3 space-y-0 p-3 bg-white rounded-xl border border-gray-100 hover:border-[#A0E7E5]/50 transition-colors"
                                                                                    >
                                                                                        <FormControl>
                                                                                            <Checkbox
                                                                                                checked={field.value?.includes(item.id)}
                                                                                                onCheckedChange={(checked) => {
                                                                                                    return checked
                                                                                                        ? field.onChange([...field.value, item.id])
                                                                                                        : field.onChange(
                                                                                                            field.value?.filter(
                                                                                                                (value) => value !== item.id
                                                                                                            )
                                                                                                        )

                                                                                                }}
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormLabel className="font-medium text-gray-700 cursor-pointer flex-1">
                                                                                            {item.label}
                                                                                        </FormLabel>
                                                                                    </FormItem>
                                                                                )
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        </Accordion>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />)}
                                            <FormField
                                                control={form.control}
                                                name="premature"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ToggleField
                                                                label="Teve parto prematuro? (antes de 37 semanas)"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="deliveryType"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ToggleField
                                                                label="Tipo de parto: Normal?"
                                                                value={field.value === "normal"}
                                                                onChange={(checked) => {
                                                                    if (checked) {
                                                                        form.setValue("deliveryType", "normal");
                                                                    } else {
                                                                        form.setValue("deliveryType", "cesarean");
                                                                    }
                                                                    if (import.meta.env.VITE_DEV_MODE === 'true') {
                                                                        console.log(form.watch("deliveryType"));
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="lowWeight"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ToggleField
                                                                label="Baixo peso ao nascer? (abaixo de 2,5kg)"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                        </CardContent>
                                    </Card>

                                    <Card className='bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-3xl'>
                                        <CardContent className='space-y-3 p-4'>

                                            <FormField
                                                control={form.control}
                                                name="highFever"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ToggleField
                                                                label="Já teve febre alta ou infecção até os 3 anos?"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="consultDentist"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ToggleField
                                                                label="Já teve consulta com dentista?"
                                                                value={field.value}
                                                                onChange={(checked) => {
                                                                    field.onChange(checked);
                                                                    if (!checked) {
                                                                        form.setValue("consultType", "");
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            {form.watch('consultDentist') && (<FormField
                                                control={form.control}
                                                name="consultType"
                                                render={({ field }) => (
                                                    <FormItem >
                                                        <FormLabel className='font-bold'>Tipo de consulta</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Consulta em qual meio" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="private">Privado</SelectItem>
                                                                <SelectItem value="public">Público</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />)}

                                        </CardContent>
                                    </Card>

                                    <div className="flex justify-center pt-2">
                                        <Button className="w-full md:w-auto md:min-w-[200px]" type="submit" disabled={submitting}>
                                            Salvar Cadastro
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )

}