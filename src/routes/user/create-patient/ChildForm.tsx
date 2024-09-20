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
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch.tsx'

// import useSWRMutation from 'swr/mutation'
import { Link } from 'react-router-dom'
import { Calendar, CalendarIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'

const formSchema = z.object({
    childName: z.string().min(4, {
        message: "Nome muito pequeno.",
    }),
    birthday: z.date(),
    highFever: z.boolean(),
    premature: z.boolean(),
    deliveryProblems: z.boolean(),
    lowWeight: z.boolean(),
    deliveryType: z.enum(["cesarean", "normal"]),
    brothers: z.boolean(),
    brothersNumber: z.number().min(1, {
        message: "Mínimo de um irmão"
    }),
    consultDentist: z.boolean(),
    consultType: z.enum(["public", "private", "none"])
})

export default function ChildForm() {
    // const { trigger, data, error } = useSWRMutation('http://localhost:8000/patients', sendRequest)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            childName: "",
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
        // const result = await trigger(values)
        // console.log('=== result ===')
        // console.log(result)
    }

    return (

        <div className='flex min-h-screen items-center justify-center'>
            <Card className='w-[90%] border-none'>
                <CardHeader>
                    <CardTitle className='text-center font-extrabold'>Cadastro da criança</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="childName"
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
                                <FormItem>
                                    <FormLabel>Data de Nascimento</FormLabel>
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
                                                selected={field.value}
                                                onSelect={field.onChange}
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
                                        <FormDescription>Sim</FormDescription>
                                        <FormControl>
                                            <Switch
                                                className='data-[state=checked]:bg-[#0F172A]'
                                                checked={field.value}
                                                onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>Não</FormDescription>
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
                                        <FormDescription>Sim</FormDescription>
                                        <FormControl>
                                            <Switch
                                                className='data-[state=checked]:bg-[#0F172A]'
                                                checked={field.value}
                                                onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>Não</FormDescription>
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
                                        <FormDescription>Sim</FormDescription>
                                        <FormControl>
                                            <Switch
                                                className='data-[state=checked]:bg-[#0F172A]'
                                                checked={field.value}
                                                onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>Não</FormDescription>
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
                                        <FormDescription>Sim</FormDescription>
                                        <FormControl>
                                            <Switch
                                                className='data-[state=checked]:bg-[#0F172A]'
                                                checked={field.value}
                                                onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>Não</FormDescription>
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
                                        <FormDescription>Sim</FormDescription>
                                        <FormControl>
                                            <Switch
                                                className='data-[state=checked]:bg-[#0F172A]'
                                                checked={field.value}
                                                onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>Não</FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="brothersNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de irmãos</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Numero de irmãos" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="consultDentist"
                            render={({ field }) => (
                                <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                    <FormLabel>Já foi a um consulta com dentista</FormLabel>
                                    <div className='flex gap-[15px] items-center justify-center'>
                                        <FormDescription>Sim</FormDescription>
                                        <FormControl>
                                            <Switch
                                                className='data-[state=checked]:bg-[#0F172A]'
                                                checked={field.value}
                                                onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormDescription>Não</FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
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
                        />
                        <Button className="bg-[#0F172A] hover:bg-[#0F172A]/90 w-[100%]" type="submit"><Link to="child">Próximo</Link></Button>
                    </form>
                </Form>
            </Card>
        </div>

    )

}