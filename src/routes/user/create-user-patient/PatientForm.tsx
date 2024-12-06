import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { format, isAfter, isBefore, startOfDay } from 'date-fns'
import { cn } from '@/lib/utils'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch.tsx'

// import useSWRMutation from 'swr/mutation'
import { useNavigate } from 'react-router-dom'
import { Calendar } from '@/components/ui/calendar.tsx'
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react"
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

async function sendRequest(url: string, { arg }: {
    arg: {
        name: string;
        birthday: Date;
        highFever: boolean;
        premature: boolean;
        deliveryProblems: boolean;
        deliveryProblemsTypes: string;
        lowWeight: boolean;
        deliveryType: "cesarean" | "normal";
        brothersNumber: number;
        consultType: "public" | "private" | "";
    }
}) {
    console.log('=== sending request to ===')
    console.log(url)
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(arg)
    }).then(res => res.json())
}

export default function PatientForm() {

    const { trigger, data, error } = useSWRMutation(`${import.meta.env.VITE_SERVER_URL}/users/patients/`, sendRequest)
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
        console.log('=== new values ===')
        console.log(values)

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

        console.log(data);
        if (result && !error) {
            setSubmitting(false)
            navigate(`/user/registers/create-register/${result.patient_id}/first_time`);
        } else {
            setSubmitting(false)
            console.error('Erro ao enviar dados:', error);
        }
        console.log('=== result ===')
        console.log(result)
    }

    return (

        <div className='overflow-auto max-h-screen'>

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className='flex flex-col min-h-screen items-start justify-center rounded-t-3xl -mt-16 bg-white pt-10 mb-20'>

                <div className="flex w-[100%] justify-start items-center px-[30px] mt-2">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 " disabled={submitting} onClick={() => navigate("/user/home")}>
                        <ArrowLeft color="black" />
                    </Button>
                </div>

                <Card className='w-full border-none'>
                    <CardHeader>
                        <CardTitle className='text-center font-extrabold'>Cadastro da criança</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-center'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <Card className='border-none shadow-lg '>
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
                                                <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                                    <FormLabel className='font-bold'>Tem irmãos</FormLabel>
                                                    <div className='flex gap-[15px] items-center justify-center'>
                                                        <FormDescription>Não</FormDescription>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={(checked) => {
                                                                    field.onChange(checked);
                                                                    if (!checked) {
                                                                        form.setValue("brothersNumber", "");
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>Sim</FormDescription>
                                                    </div>
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
                                <Card className='border-none shadow-lg '>
                                    <CardContent className='space-y-3 p-4'>
                                        <FormField
                                            control={form.control}
                                            name="deliveryProblems"
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                                    <FormLabel className='font-bold'>A mãe teve problemas durante a gravidez ?</FormLabel>
                                                    <div className='flex gap-[15px] items-center justify-center'>
                                                        <FormDescription>Não</FormDescription>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={(checked) => {
                                                                    field.onChange(checked);
                                                                    if (!checked) {
                                                                        form.setValue("deliveryProblemsTypes", []);
                                                                    }
                                                                }} />
                                                        </FormControl>
                                                        <FormDescription>Sim</FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        {form.watch('deliveryProblems') && (<FormField
                                            control={form.control}
                                            name="deliveryProblemsTypes"
                                            render={() => (
                                                <FormItem >

                                                    <Accordion type="single" collapsible>
                                                        <AccordionItem value="item-1">
                                                            <AccordionTrigger className='hover:no-underline'>Quais problemas ?</AccordionTrigger>
                                                            <AccordionContent className='space-y-2'>

                                                                {deliveryProblems.map((item) => (
                                                                    <FormField
                                                                        key={item.id}
                                                                        control={form.control}
                                                                        name="deliveryProblemsTypes"
                                                                        render={({ field }) => {
                                                                            return (

                                                                                <FormItem
                                                                                    key={item.id}
                                                                                    className="flex flex-row items-start space-x-3 space-y-0"
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
                                                                                    <FormLabel className="">
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
                                                <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                                    <div className='flex flex-col justify-center items-center space-y-1'>
                                                        <FormLabel className='font-bold'>Teve parto prematuro ? </FormLabel>
                                                        <FormDescription className='text-xs'>(antes de 37 semanas de gestação)</FormDescription>
                                                    </div>
                                                    <div className='flex gap-[15px] items-center justify-center'>
                                                        <FormDescription>Não</FormDescription>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormDescription>Sim</FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="deliveryType"
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                                    <FormLabel className='font-bold'>Tipo de parto</FormLabel>
                                                    <div className='flex gap-[15px] items-center justify-center'>
                                                        <FormDescription>Cesárea</FormDescription>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value === "normal" ? true : false}
                                                                onCheckedChange={(checked) => {
                                                                    field.onChange(checked);
                                                                    if (!checked) {
                                                                        form.setValue("deliveryType", "cesarean");
                                                                    } else {
                                                                        form.setValue("deliveryType", "normal");
                                                                    }
                                                                    console.log(form.watch("deliveryType"))
                                                                }} />
                                                        </FormControl>
                                                        <FormDescription>Normal</FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lowWeight"
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                                    <div className='flex flex-col justify-center items-center space-y-1'>
                                                        <FormLabel className='font-bold'>A criança teve baixo peso ao nascer ?</FormLabel>
                                                        <FormDescription className='text-xs'>(abaixo de 2,5kg)</FormDescription>
                                                    </div>
                                                    <div className='flex gap-[15px] items-center justify-center'>
                                                        <FormDescription>Não</FormDescription>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormDescription>Sim</FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                    </CardContent>
                                </Card>

                                <Card className='border-none shadow-lg '>
                                    <CardContent className='space-y-3 p-4'>

                                        <FormField
                                            control={form.control}
                                            name="highFever"
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                                    <FormLabel className='font-bold text-center'>A criança já teve febre alta ou infecção até os 3 anos ?</FormLabel>
                                                    <div className='flex gap-[15px] items-center justify-center'>
                                                        <FormDescription>Não</FormDescription>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormDescription>Sim</FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="consultDentist"
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                                    <FormLabel className='font-bold'>A criança já teve consulta com dentista ?</FormLabel>
                                                    <div className='flex gap-[15px] items-center justify-center'>
                                                        <FormDescription>Não</FormDescription>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={(checked) => {
                                                                    field.onChange(checked);
                                                                    if (!checked) {
                                                                        form.setValue("consultType", "");
                                                                    }
                                                                }} />
                                                        </FormControl>
                                                        <FormDescription>Sim</FormDescription>
                                                    </div>
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

                                <Button className=" w-[100%]" type="submit" disabled={submitting}>
                                    Salvar
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div >


    )

}