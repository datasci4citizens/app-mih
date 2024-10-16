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
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch.tsx'

import useSWRMutation from 'swr/mutation'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
    motherName: z.string().min(4, {
        message: "Nome muito pequeno.",
    }),
    fatherName: z.string().min(4, {
        message: "Nome muito pequeno.",
    }),
    phone_number: z.string().min(11, {
        message: "O telefone deve ter no mínimo 11 dígitos.",
    }),
    state: z.string().min(2, {
        message: "O Estado deve ter no mínimo 2 dígitos.",
    }),
    city: z.string().min(2, {
        message: "A cidade deve ter no mínimo 2 dígitos.",
    }),
    neighborhood: z.string().min(2, {
        message: "O Bairro deve ter no mínimo 2 dígitos.",
    }),
    accept_tcle: z.boolean().refine(val => val === true, {
        message: "É necessário que concorde com os termos para avançar.",
    })
})

async function sendRequest(url: string, { arg }: {
    arg: {
        motherName: string;
        fatherName: string;
        phone_number: string;
        state: string;
        city: string;
        neighborhood: string;
        accept_tcle: boolean;
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


export default function CreatePatient() {
    const { trigger, data, error } = useSWRMutation('http://127.0.0.1:8000/users/', sendRequest)
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            motherName: "",
            fatherName: "",
            phone_number: "",
            state: "",
            city: "",
            neighborhood: "",
            accept_tcle: false
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('=== new values ===')
        console.log(values)
        const result = await trigger(values)
        console.log('=== result ===')
        console.log(result)
        console.log(data)
        console.log(error);
        if (result && !error) {
            navigate(`patient/${result.id}`); // Redireciona para a home
        } else {
            console.error('Erro ao enviar dados:', error);
        }
    }

    return (

        <div>

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className='flex min-h-screen items-start justify-center rounded-t-3xl -mt-16 bg-white pt-10'>
                <Card className='w-[90%] border-none overflow-auto max-h-screen'>
                    <CardHeader>
                        <CardTitle className='text-center font-extrabold'>Cadastro responsável</CardTitle>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

                            <FormField
                                control={form.control}
                                name="motherName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da Mãe</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome da Mãe" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Insira o nome completo da mãe
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fatherName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Pai</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome do Pai" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Insira o nome completo do pai
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numero de telefone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Telefone" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Insira o telefone para contato
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Estado onde mora" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cidade onde mora" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="neighborhood"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bairro</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Bairro onde mora" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accept_tcle"
                                render={({ field }) => (
                                    <FormItem className='flex gap-[10px] items-center justify-center'>
                                        <FormControl>
                                            <Switch
                                                className='data-[state=checked]:bg-[#0F172A]'
                                                checked={field.value}
                                                onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>Li e aceito os termos TLCE</FormLabel>
                                    </FormItem>
                                )}
                            />

                            <Button className="w-[100%]" type="submit">Próximo</Button>
                        </form>
                    </Form>
                </Card>
            </div >
        </div>


    )

}