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
import { Link } from 'react-router-dom'

async function sendRequest(url, { arg }: {
    arg: {
        motherName: string;
        fatherName: string;
        phone_number: string;
        cep: string;
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
    cep: z.string().min(8, {
        message: "O cep deve ter no mínimo 8 dígitos.",
    }),
    accept_tcle: z.boolean()
})


export default function CreatePatient() {
    const { trigger, data, error } = useSWRMutation('http://localhost:8000/patients', sendRequest)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            motherName: "",
            fatherName: "",
            phone_number: "",
            cep: "",
            accept_tcle: false
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

        <div className='flex min-h-screen items-center justify-center'>
            <Card className='w-[90%] border-none'>
                <CardHeader>
                    <CardTitle className='text-center font-extrabold'>Complete o seu cadastro</CardTitle>
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
                            name="cep"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cep da residência</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Cep" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Insira o Cep da residência
                                    </FormDescription>
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
                        <Button className="bg-[#0F172A] hover:bg-[#0F172A]/90 w-[100%]" type="submit"><Link to="child">Próximo</Link></Button>
                    </form>
                </Form>
            </Card>
        </div>

    )

}