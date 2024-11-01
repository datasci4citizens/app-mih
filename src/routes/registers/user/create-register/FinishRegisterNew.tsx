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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch.tsx'

// import useSWRMutation from 'swr/mutation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select.tsx'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'

const formSchema = z.object({
    toothache: z.boolean(),
    painLevel: z.number(),
    sensitivity: z.boolean(),
    toothStain: z.boolean(),
    aestheticDiscomfort: z.boolean(),
    userObservations: z.string()


}).superRefine((values, ctx) => {
    console.log(values.toothache)
    console.log(values.painLevel)
    if (values.toothache && values.painLevel === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['painLevel'],
            message: "Selecione um nível de dor",
        });
    }
});

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
    painLevel: number,
    sensitivity: boolean,
    toothStain: boolean,
    aestheticDiscomfort: boolean,
    userObservations: string
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
    userObservations,
    updateFields,
    next,
    back
}: FinishRegisterFormsProps) {
    // const { trigger, data, error } = useSWRMutation('http://127.0.0.1:8000/patients', sendRequest)

    // const { formData, updateFormData } = useFormContext();

    console.log({
        toothache,
        painLevel,
        sensitivity,
        toothStain,
        aestheticDiscomfort,
        userObservations,
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            toothache: false,
            painLevel: 0,
            sensitivity: false,
            toothStain: false,
            aestheticDiscomfort: false,
            userObservations: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        next()
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
                                    render={() => (
                                        <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                            <FormLabel className='font-bold'>A criança sente dor nos dentes ?</FormLabel>
                                            <div className='flex gap-[15px] items-center justify-center'>
                                                <FormDescription>Não</FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        checked={toothache}
                                                        onCheckedChange={(checked) => {
                                                            updateFields({ toothache: checked });
                                                            form.setValue("toothache", checked);

                                                            if (!checked) {
                                                                updateFields({ painLevel: 0 });
                                                                form.setValue("painLevel", 0);
                                                            }

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
                                    render={() => (
                                        <FormItem >
                                            <FormLabel className='font-bold'>Nível da dor </FormLabel>
                                            <Select
                                                onValueChange={e => {
                                                    updateFields({ painLevel: Number(e) })
                                                    form.setValue("painLevel", Number(e));
                                                }}
                                                defaultValue={String(painLevel)}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o nível de dor" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">Leve</SelectItem>
                                                    <SelectItem value="2">Moderada</SelectItem>
                                                    <SelectItem value="3">Intensa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />)}
                                <FormField
                                    control={form.control}
                                    name="sensitivity"
                                    render={() => (
                                        <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                            <FormLabel className='font-bold'>A criança tem sensibilidade nos dentes ?</FormLabel>
                                            <div className='flex gap-[15px] items-center justify-center'>
                                                <FormDescription>Não</FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        checked={sensitivity}
                                                        onCheckedChange={checked => {
                                                            updateFields({ sensitivity: checked })
                                                            form.setValue("sensitivity", checked);

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
                                    render={() => (
                                        <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                            <FormLabel className='font-bold'>A criança apresenta mancha nos dentes ?</FormLabel>
                                            <div className='flex gap-[15px] items-center justify-center'>
                                                <FormDescription>Não</FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        checked={toothStain}
                                                        onCheckedChange={(checked) => {
                                                            updateFields({ toothStain: checked })
                                                            form.setValue("toothStain", checked);

                                                            if (!checked) {
                                                                updateFields({ aestheticDiscomfort: false })
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
                                    render={() => (
                                        <FormItem className='flex flex-col gap-[10px] items-center justify-center'>
                                            <FormLabel className='font-bold'>A mancha gera desconforto estético ?</FormLabel>
                                            <div className='flex gap-[15px] items-center justify-center'>
                                                <FormDescription>Não</FormDescription>
                                                <FormControl>
                                                    <Switch
                                                        checked={aestheticDiscomfort}
                                                        onCheckedChange={checked => {
                                                            updateFields({ aestheticDiscomfort: checked })
                                                            form.setValue("aestheticDiscomfort", checked);

                                                        }} />
                                                </FormControl>
                                                <FormDescription>Sim</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />)}
                                <FormField
                                    control={form.control}
                                    name="userObservations"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Observações</FormLabel>
                                            <FormControl>
                                                <Textarea

                                                    placeholder="Observações adicionais"
                                                    className="resize-none "
                                                    value={userObservations}
                                                    onChange={e => {
                                                        updateFields({ userObservations: e.target.value })
                                                        form.setValue("userObservations", e.target.value);

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