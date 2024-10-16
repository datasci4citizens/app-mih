import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

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
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch.tsx'

// import useSWRMutation from 'swr/mutation'
import { Link } from 'react-router-dom'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select.tsx'
import useSWRMutation from 'swr/mutation'

const formSchema = z.object({
    toothache: z.boolean(),
    painLevel: z.enum(["mild", "moderate", "intense", "none"]),
    sensitivity: z.boolean(),
    toothStain: z.boolean(),
    aestheticDiscomfort: z.boolean(),
    observations: z.string()


})

// async function sendRequest(url, { arg }: {
//     arg: {
//         childName: string;
//         birthday: Date;
//         highFever: boolean;
//         premature: boolean;
//         deliveryProblems: boolean;
//         lowWeight: boolean;
//         deliveryType: "cesarean" | "normal";
//         brothers: boolean;
//         brothersNumber: string;
//         consultDentist: boolean;
//         consultType: "public" | "private" | "none";
//     }
// }) {
//     console.log('=== sending request to ===')
//     console.log(url)
//     return await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(arg)
//     }).then(res => res.json())
// }


export default function FinishRegisterNew() {
    // const { trigger, data, error } = useSWRMutation('http://127.0.0.1:8000/patients', sendRequest)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            toothache: false,
            painLevel: "none",
            sensitivity: false,
            toothStain: false,
            aestheticDiscomfort: false,
            observations: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('=== new values ===')
        console.log(values)
        const result = await trigger(values)
        console.log('=== result ===')
        console.log(result)
    }

    return (

        <div className='overflow-auto max-h-screen min-h-screen'>

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className='flex items-start justify-start p-[20px] pt-[100px] rounded-t-3xl -mt-16 bg-white'>

                <Card className='w-[100%] border-none '>
                    <CardHeader>
                        <CardTitle className='text-center font-extrabold'>Terminar seu registro</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-center'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="toothache"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                            <FormLabel>Sente dor nos dentes</FormLabel>
                                            <div className='flex gap-[15px] items-center justify-center'>
                                                <FormDescription>Não</FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        className='data-[state=checked]:bg-[#0F172A]'
                                                        checked={field.value}
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked);
                                                            if (!checked) {
                                                                form.setValue("painLevel", "none");
                                                            }
                                                        }} />
                                                </FormControl>
                                                <FormDescription>Sim</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {form.watch('toothache') && (<FormField
                                    control={form.control}
                                    name="painLevel"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>Nível da dor</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Consulta em qual meio" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="mild">Leve</SelectItem>
                                                    <SelectItem value="moderate">Moderada</SelectItem>
                                                    <SelectItem value="intense">Intensa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />)}
                                <FormField
                                    control={form.control}
                                    name="sensitivity"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                            <FormLabel>Sensibilidade nos dentes</FormLabel>
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
                                    name="toothStain"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                            <FormLabel>Apresenta mancha nos dentes</FormLabel>
                                            <div className='flex gap-[15px] items-center justify-center'>
                                                <FormDescription>Não</FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        className='data-[state=checked]:bg-[#0F172A]'
                                                        checked={field.value}
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked);
                                                            if (!checked) {
                                                                form.setValue("aestheticDiscomfort", false);
                                                            }
                                                        }} />
                                                </FormControl>
                                                <FormDescription>Sim</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {form.watch('toothStain') && (<FormField
                                    control={form.control}
                                    name="aestheticDiscomfort"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                            <FormLabel>A mancha gera desconforto estético</FormLabel>
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
                                />)}
                                <FormField
                                    control={form.control}
                                    name="observations"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Observações</FormLabel>
                                            <FormControl>
                                                <Input className="w-[300px]" placeholder="Observações adicionais" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='flex absolute inset-x-0 justify-center bottom-[40px]'>
                                    <Button className="w-[300px] text-center" type="submit">
                                        <Link to="/user/home">Enviar registro</Link>
                                    </Button>
                                </div>

                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>


    )

}