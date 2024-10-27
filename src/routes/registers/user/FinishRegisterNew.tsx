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
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select.tsx'
import useSWRMutation from 'swr/mutation'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'

const formSchema = z.object({
    toothache: z.boolean(),
    painLevel: z.enum(["mild", "moderate", "intense", ""]),
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
type FinishRegisterData = {
    toothache: boolean,
    painLevel: "mild" | "moderate" | "intense" | "",
    sensitivity: boolean,
    toothStain: boolean,
    aestheticDiscomfort: boolean,
    observations: string
}

type FinishRegisterFormsProps = FinishRegisterData & {
    updateFields: (fields: Partial<FinishRegisterData>) => void,
    next: () => void | undefined,
    back: () => void | undefined
}

export default function FinishRegisterNew({
    toothache,
    painLevel,
    sensitivity,
    toothStain,
    aestheticDiscomfort,
    observations,
    updateFields,
    next,
    back
}: FinishRegisterFormsProps) {
    // const { trigger, data, error } = useSWRMutation('http://127.0.0.1:8000/patients', sendRequest)

    // const { formData, updateFormData } = useFormContext();

    const { id } = useParams();

    console.log({
        toothache,
        painLevel,
        sensitivity,
        toothStain,
        aestheticDiscomfort,
        observations,
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            toothache: false,
            painLevel: "",
            sensitivity: false,
            toothStain: false,
            aestheticDiscomfort: false,
            observations: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        updateFields({ ...values })
    }

    return (

        <div className='overflow-auto max-h-screen min-h-screen'>

            <div className="bg-[#0C4A6E] h-32 w-full"></div>

            <div className='flex flex-col items-start justify-center pt-[30px] rounded-t-3xl -mt-16 bg-white'>

                <div className="flex w-[100%] justify-start items-center px-[30px] mt-2 mb-10">

                    <Button size={"icon"} className="bg-[#E2E8F0] hover:bg-[#E2E8F0]/70 " onClick={back}>
                        <ArrowLeft color="black" />
                    </Button>
                </div>

                <Card className='w-[100%] border-none'>
                    <CardHeader>
                        <CardTitle className='text-center font-extrabold mb-10'>Terminar seu registro</CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center justify-center'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="toothache"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                            <FormLabel className='font-bold'>A criança sente dor nos dentes ?</FormLabel>
                                            <div className='flex gap-[15px] items-center justify-center'>
                                                <FormDescription>Não</FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        checked={toothache}
                                                        onCheckedChange={(checked) => {
                                                            updateFields({ toothache: checked })
                                                        }} />
                                                </FormControl>
                                                <FormDescription>Sim</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {toothache && (<FormField
                                    control={form.control}
                                    name="painLevel"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel className='font-bold'>Nível da dor </FormLabel>
                                            <Select onValueChange={e => {
                                                updateFields({ painLevel: e })
                                            }} defaultValue={painLevel}>
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
                                            <FormLabel className='font-bold'>A criança tem sensibilidade nos dentes ?</FormLabel>
                                            <div className='flex gap-[15px] items-center justify-center'>
                                                <FormDescription>Não</FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        checked={sensitivity}
                                                        onCheckedChange={checked => {
                                                            updateFields({ sensitivity: checked })
                                                        }} />
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
                                            <FormLabel className='font-bold'>A criança apresenta mancha nos dentes ?</FormLabel>
                                            <div className='flex gap-[15px] items-center justify-center'>
                                                <FormDescription>Não</FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        checked={toothStain}
                                                        onCheckedChange={(checked) => {
                                                            updateFields({ toothStain: checked })
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
                                {toothStain && (<FormField
                                    control={form.control}
                                    name="aestheticDiscomfort"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                            <FormLabel className='font-bold'>A mancha gera desconforto estético</FormLabel>
                                            <div className='flex gap-[15px] items-center justify-center'>
                                                <FormDescription>Não</FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        checked={aestheticDiscomfort}
                                                        onCheckedChange={checked => {
                                                            updateFields({ aestheticDiscomfort: checked })
                                                        }} />
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
                                                <Textarea

                                                    placeholder="Observações adicionais"
                                                    className="resize-none "
                                                    value={observations}
                                                    onChange={e => {
                                                        updateFields({ observations: e.target.value })
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button className="w-[300px] text-center" type="submit">
                                    Próximo
                                </Button>


                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>


    )

}