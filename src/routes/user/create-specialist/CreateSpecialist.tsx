import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { redirect } from "react-router-dom";

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
import { Link } from 'react-router-dom'



const formSchema = z.object({
    name: z.string().min(4, {
        message: "Nome muito pequeno.",
    }),
    phone_number: z.string().min(11, {
        message: "O email deve ter no mínimo 11 dígitos.",
    }),
    email: z.string().min(11, {
        message: "O telefone deve ter no mínimo 11 dígitos.",
    }),
})

async function sendRequest(url: string, { arg }: {
    arg: {
        name: string;
        email: string;
        phone_number: string;
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


export default function CreateSpecialist() {
    const { trigger, data, error } = useSWRMutation('http://127.0.0.1:8000/specialists/', sendRequest)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone_number: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('=== new values ===')
        console.log(values)
        const result = await trigger(values)
        console.log('=== result ===')
        console.log(result)
        console.log(data)
        console.log(error)
        return redirect('specialist/home');
    }

    return (

        <div className='flex min-h-screen items-center justify-center'>
            <Card className='w-[90%] border-none overflow-auto max-h-screen'>
                <CardHeader>
                    <CardTitle className='text-center font-extrabold'>Complete o seu cadastro</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Insira o seu nome completo
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email de cadastro" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Insira o email usado no login com o google
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

                        <Button className="bg-[#0F172A] hover:bg-[#0F172A]/90 w-[100%]" type="submit"><Link to="/specialist/home">Próximo</Link></Button>
                    </form>
                </Form>
            </Card>
        </div >

    )

}