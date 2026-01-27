import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from '@/components/ui/textarea'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { useFormContext } from './CreateRegisterForm'
import { ToggleField } from '@/components/ui/toggle-field'
import { ActionButton } from '@/components/ui/action-button'
import { ToyBackground } from '@/components/ui/toy-background'
import { cn } from '@/lib/utils'

const formSchema = z.object({
    toothache: z.boolean(),
    painLevel: z.number(),
    sensitivity: z.boolean(),
    toothStain: z.boolean(),
    aestheticDiscomfort: z.boolean(),
    userObservations: z.string()
}).superRefine((values, ctx) => {
    if (values.toothache && values.painLevel === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['painLevel'],
            message: "Selecione um nível de dor",
        });
    }
});

// Pain Level Selector Component
interface PainLevelSelectorProps {
    value: number;
    onChange: (value: number) => void;
}

const PainLevelSelector = ({ value, onChange }: PainLevelSelectorProps) => {
    const levels = [
        { value: 1, label: 'Leve', color: 'bg-yellow-400' },
        { value: 2, label: 'Moderada', color: 'bg-orange-400' },
        { value: 3, label: 'Intensa', color: 'bg-red-500' },
    ];

    return (
        <div className="bg-gray-50 p-4 rounded-xl space-y-3 border-l-4 border-[#FF8A65]">
            <label className="text-sm font-semibold text-gray-700">Nível da dor</label>
            <div className="flex gap-2">
                {levels.map((level) => (
                    <button
                        key={level.value}
                        type="button"
                        onClick={() => onChange(level.value)}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-sm font-bold text-white transition-all transform active:scale-95",
                            value === level.value
                                ? `${level.color} shadow-md scale-105`
                                : 'bg-gray-300'
                        )}
                    >
                        {level.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function FinishRegisterNew() {

    const { sendData, updateFields, next, back } = useFormContext();

    const { toothache,
        painLevel,
        sensitivity,
        toothStain,
        aestheticDiscomfort,
        userObservations,
    } = { ...sendData };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            toothache: toothache || false,
            painLevel: painLevel || 0,
            sensitivity: sensitivity || false,
            toothStain: toothStain || false,
            aestheticDiscomfort: aestheticDiscomfort || false,
            userObservations: userObservations || ""
        },
    })

    const handleChange = (field: string, value: any) => {
        updateFields({ [field]: value });
        form.setValue(field as keyof z.infer<typeof formSchema>, value);

        // Reset dependent fields
        if (field === 'toothache' && !value) {
            updateFields({ painLevel: 0 });
            form.setValue('painLevel', 0);
        }
        if (field === 'toothStain' && !value) {
            updateFields({ aestheticDiscomfort: false });
            form.setValue('aestheticDiscomfort', false);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log(values);
        }
        next()
    }

    return (
        <div className="w-full min-h-screen bg-[#A0E7E5] relative overflow-auto">
            <ToyBackground />

            <div className="relative z-10 min-h-screen flex flex-col pb-10">
                {/* Header */}
                <div className="px-6 pb-4 flex items-center gap-4" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' }}>
                    <button onClick={back} className="bg-white/40 hover:bg-white/60 text-gray-700 rounded-full h-12 w-12 border border-white/50 backdrop-blur-md shadow-lg transition-colors flex items-center justify-center">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Questionário</h1>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="w-full max-w-md md:max-w-4xl">
                        <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
                            <p className="text-gray-600 text-center mb-2">
                                Responda algumas perguntas sobre a criança.
                            </p>


                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <FormField
                                            control={form.control}
                                            name="toothache"
                                            render={() => (
                                                <FormItem>
                                                    <FormControl>
                                                        <ToggleField
                                                            label="A criança sente dor de dente?"
                                                            value={toothache}
                                                            onChange={(val) => handleChange('toothache', val)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {toothache && (
                                            <FormField
                                                control={form.control}
                                                name="painLevel"
                                                render={() => (
                                                    <FormItem className="md:col-span-1">
                                                        <FormControl>
                                                            <PainLevelSelector
                                                                value={painLevel}
                                                                onChange={(val) => handleChange('painLevel', val)}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        <FormField
                                            control={form.control}
                                            name="sensitivity"
                                            render={() => (
                                                <FormItem>
                                                    <FormControl>
                                                        <ToggleField
                                                            label="Tem sensibilidade nos dentes?"
                                                            value={sensitivity}
                                                            onChange={(val) => handleChange('sensitivity', val)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="toothStain"
                                            render={() => (
                                                <FormItem>
                                                    <FormControl>
                                                        <ToggleField
                                                            label="Apresenta mancha nos dentes?"
                                                            value={toothStain}
                                                            onChange={(val) => handleChange('toothStain', val)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {toothStain && (
                                            <FormField
                                                control={form.control}
                                                name="aestheticDiscomfort"
                                                render={() => (
                                                    <FormItem className="md:col-span-2">
                                                        <FormControl>
                                                            <ToggleField
                                                                label="A mancha gera desconforto estético?"
                                                                value={aestheticDiscomfort}
                                                                onChange={(val) => handleChange('aestheticDiscomfort', val)}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        <FormField
                                            control={form.control}
                                            name="userObservations"
                                            render={() => (
                                                <FormItem className="md:col-span-2">
                                                    <FormLabel className="block text-sm font-semibold text-gray-600 mb-1 ml-1">Observações</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Adicione uma observação..."
                                                            rows={3}
                                                            value={userObservations}
                                                            onChange={(e) => handleChange('userObservations', e.target.value)}
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#A0E7E5] focus:ring-2 focus:ring-[#A0E7E5]/20 text-gray-700 transition-all resize-none"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <div className="w-full md:w-auto md:min-w-[200px]">
                                            <ActionButton type="submit" icon={ArrowRight}>
                                                Ver Resumo
                                            </ActionButton>
                                        </div>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}