import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { format } from 'date-fns'
import { cn } from '@/lib/utils'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
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
            deliveryType: "cesarean",
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
                        <Button className="bg-[#0F172A] hover:bg-[#0F172A]/90 w-[100%]" type="submit"><Link to="child">Próximo</Link></Button>
                    </form>
                </Form>
            </Card>
        </div>

    )

}