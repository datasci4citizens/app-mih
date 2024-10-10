import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { format } from 'date-fns'
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
import { Link } from 'react-router-dom'
import { Calendar } from '@/components/ui/calendar.tsx'
import { Calendar as CalendarIcon } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select.tsx'
import useSWRMutation from 'swr/mutation'

const formSchema = z.object({
    name: z.string().min(4, {
        message: "Nome muito pequeno.",
    }),
    birthday: z.date(),
    highFever: z.boolean(),
    premature: z.boolean(),
    deliveryProblems: z.boolean(),
    lowWeight: z.boolean(),
    deliveryType: z.enum(["cesarean", "normal"]),
    brothers: z.boolean(),
    brothersNumber: z.number(),
    consultDentist: z.boolean(),
    consultType: z.enum(["public", "private", "none"])
})

async function sendRequest(url: string, { arg }: {
    arg: {
        name: string;
        birthday: Date;
        highFever: boolean;
        premature: boolean;
        deliveryProblems: boolean;
        lowWeight: boolean;
        deliveryType: "cesarean" | "normal";
        brothersNumber: number;
        consultType: "public" | "private" | "none";
    }
}) {
    console.log('=== sending request to ===')
    console.log(url)
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(arg)
    }).then(res => res.json())
}


export default function ChildForm() {
    const { trigger, data, error } = useSWRMutation('http://127.0.0.1:8000/patients/', sendRequest)

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
            brothers: false,
            brothersNumber: 0,
            consultDentist: false,
            consultType: "none"
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('=== new values ===')
        console.log(values)
        const { brothers, consultDentist, ...newValues } = values;
        const result = await trigger(newValues)
        console.log('=== result ===')
        console.log(result)
    }

    return (

        <div className='flex min-h-screen items-center justify-center'>


            <Card className='w-[90%] border-none overflow-auto max-h-screen'>
                <CardHeader>
                    <CardTitle className='text-center font-extrabold'>Cadastro da criança</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col items-center justify-center'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da criança</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome da criança" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField control={form.control} name="birthday"
                                render={({ field }) => (
                                    <FormItem className='text-center'>
                                        <FormLabel >Data de Nascimento</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Selecione uma data</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined} // Garante que seja um Date
                                                    onSelect={(date) => field.onChange(date)} // Garante que o valor selecionado seja uma data válida
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )} />
                            <FormField
                                control={form.control}
                                name="highFever"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                        <FormLabel>Febre alta</FormLabel>
                                        <div className='flex gap-[15px] items-center justify-center'>
                                            <FormDescription>Não</FormDescription>
                                            <FormControl>
                                                <Switch
                                                    className='data-[state=checked]:bg-[#0F172A]'
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
                                name="premature"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                        <FormLabel>Nascimento prematuro</FormLabel>
                                        <div className='flex gap-[15px] items-center justify-center'>
                                            <FormDescription>Não</FormDescription>
                                            <FormControl>
                                                <Switch
                                                    className='data-[state=checked]:bg-[#0F172A]'
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
                                name="deliveryProblems"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                        <FormLabel>Problemas no parto</FormLabel>
                                        <div className='flex gap-[15px] items-center justify-center'>
                                            <FormDescription>Não</FormDescription>
                                            <FormControl>
                                                <Switch
                                                    className='data-[state=checked]:bg-[#0F172A]'
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
                                name="lowWeight"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                        <FormLabel>Baixo peso ao nascer</FormLabel>
                                        <div className='flex gap-[15px] items-center justify-center'>
                                            <FormDescription>Não</FormDescription>
                                            <FormControl>
                                                <Switch
                                                    className='data-[state=checked]:bg-[#0F172A]'
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormDescription>Sim</FormDescription>
                                        </div>
                                        <FormDescription className='text-xs'>(abaixo de 2,5kg)</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="deliveryType"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Tipo de parto</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um tipo de parto" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="cesarean">Cesária</SelectItem>
                                                <SelectItem value="normal">Normal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brothers"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                        <FormLabel>Tem irmãos</FormLabel>
                                        <div className='flex gap-[15px] items-center justify-center'>
                                            <FormDescription>Não</FormDescription>
                                            <FormControl>
                                                <Switch
                                                    className='data-[state=checked]:bg-[#0F172A]'
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        if (!checked) {
                                                            form.setValue("brothersNumber", 0);
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
                                            <FormLabel>Número de irmãos</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Número de irmãos" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="consultDentist"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                        <FormLabel>Já foi a um consulta com dentista</FormLabel>
                                        <div className='flex gap-[15px] items-center justify-center'>
                                            <FormDescription>Não</FormDescription>
                                            <FormControl>
                                                <Switch
                                                    className='data-[state=checked]:bg-[#0F172A]'
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        if (!checked) {
                                                            form.setValue("consultType", "none");
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
                                        <FormLabel>Tipo de consulta</FormLabel>
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


                            <Button className="bg-[#0F172A] hover:bg-[#0F172A]/90 w-[100%]" type="submit">
                                <Link to="/patient-home">Adicionar</Link>
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>

    )

}