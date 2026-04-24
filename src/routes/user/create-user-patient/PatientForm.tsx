import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { differenceInYears, isAfter, isBefore, startOfDay } from 'date-fns'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from '@/components/ui/card'
import { ToggleField } from '@/components/ui/toggle-field'
import { TcleModalSecure } from '@/components/ui/tcle-modal-secure'

import { useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertCircle, Loader2 } from "lucide-react"
import { ToyBackground } from "@/components/ui/toy-background"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select.tsx'
import useSWRMutation from 'swr/mutation'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import ErrorPage from '@/lib/components_utils/ErrorPage'
import { useState, useEffect, useRef } from 'react'
import DatePicker from '@/components/ui/date-picker'
import apiClient from '@/lib/axios'
import { useUser } from '@/lib/hooks/use-user'
import { useConsentDocuments } from '@/lib/hooks/useConsentDocuments'


const deliveryProblems = [
    {
        id: "anemia",
        label: "Anemia",
    },
    {
        id: "preeclampsia",
        label: "Pré-eclâmpsia",
    },
    {
        id: "hipertension",
        label: "Hipertensão",
    },
] as const

const formSchema = z.object({
    name: z.string().min(4, {
        message: "Nome muito pequeno.",
    }),
    birthday: z.date(),
    highFever: z.boolean(),
    premature: z.boolean(),
    deliveryProblems: z.boolean(),
    deliveryProblemsTypes: z.array(z.string()),
    lowWeight: z.boolean(),
    deliveryType: z.enum(["cesarean", "normal"]),
    brothers: z.boolean(),
    brothersNumber: z.string(),
    consultDentist: z.boolean(),
    consultType: z.enum(["public", "private", ""]),
    accept_tale: z.boolean().optional(),
}).superRefine((values, ctx) => {
    if (values.deliveryProblems && values.deliveryProblemsTypes.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['deliveryProblemsTypes'],
            message: "Você deve selecionar pelo menos um problema",
        });
    }
    if (Number(values.brothersNumber) <= 0 && values.brothers) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['brothersNumber'],
            message: "Pelo menos 1 irmão",
        });
    }
});

async function sendRequest(url: string, { arg }: { arg: any }) {
    return await apiClient.post(url, arg)
}

export default function PatientForm() {

    const { trigger, data, error } = useSWRMutation(`/api/patients/`, sendRequest)
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()
    const { consent } = useUser()
    const participatesInResearch = consent?.tcle?.accepted ?? false

    // ── Estado do modal de TALE ──────────────────────────────────────────────
    const [taleModalOpen, setTaleModalOpen] = useState(false)
    const [taleUnlocked, setTaleUnlocked] = useState(false)
    const [taleAccepted, setTaleAccepted] = useState(false)
    const [talePresignedUrl, setTalePresignedUrl] = useState<string | null>(null)
    const [taleDocumentId, setTaleDocumentId] = useState<number | null>(null)
    const taleUrlFetchedRef = useRef(false)

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
            deliveryProblemsTypes: [],
            brothers: false,
            brothersNumber: "",
            consultDentist: false,
            consultType: "",
            accept_tale: false,
        },
    })

    // ── Calcula faixa etária a partir do birthday ────────────────────────────
    const watchedBirthday = form.watch('birthday')
    const childAge = watchedBirthday ? differenceInYears(new Date(), watchedBirthday) : null
    const taleType: 'tale_6_9' | 'tale_10_12' | null =
        childAge !== null && childAge >= 6 && childAge <= 9 ? 'tale_6_9'
        : childAge !== null && childAge >= 10 && childAge <= 12 ? 'tale_10_12'
        : null

    // ── Carrega documento TALE ativo ─────────────────────────────────────────
    const { documents: taleDocuments, loading: taleDocsLoading, getPresignedUrl } = useConsentDocuments(
        taleType ? { type: taleType } : undefined
    )

    // Atualiza ID do documento TALE quando carregado
    useEffect(() => {
        const doc = taleDocuments.find(d => d.consent_type === taleType)
        if (doc) setTaleDocumentId(doc.id)
        else setTaleDocumentId(null)
    }, [taleDocuments, taleType])

    // Reseta estado do TALE quando a faixa etária muda
    useEffect(() => {
        setTaleUnlocked(false)
        setTaleAccepted(false)
        setTalePresignedUrl(null)
        taleUrlFetchedRef.current = false
        form.setValue('accept_tale', false)
    }, [taleType])

    // Gera presigned URL ao abrir o modal TALE
    useEffect(() => {
        if (taleModalOpen && taleDocumentId && !taleUrlFetchedRef.current && taleType) {
            taleUrlFetchedRef.current = true
            getPresignedUrl(taleType, 'pt-BR').then(response => {
                if (response?.presigned_url) {
                    setTalePresignedUrl(response.presigned_url)
                    // Sincroniza o ID com o documento real que a URL aponta,
                    // evitando race condition quando o admin publica nova versão
                    // entre o carregamento da lista e a abertura do modal.
                    if (response?.document_id) setTaleDocumentId(response.document_id)
                }
            })
        } else if (!taleModalOpen) {
            taleUrlFetchedRef.current = false
        }
    }, [taleModalOpen, taleDocumentId, taleType])

    // TALE obrigatório se: participa da pesquisa + criança na faixa + documento disponível
    const taleRequired = participatesInResearch && taleType !== null && taleDocumentId !== null
    const taleBlocksSubmit = taleRequired && !taleAccepted
    // TALE necessário mas sem documento configurado no sistema
    const taleMissingDoc = participatesInResearch && taleType !== null && !taleDocsLoading && taleDocumentId === null

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Bloqueia submit se TALE obrigatório e não aceito
        if (taleBlocksSubmit) {
            form.setError('accept_tale', {
                message: 'O TALE é obrigatório para crianças participantes da pesquisa nessa faixa etária.',
            })
            return
        }

        setSubmitting(true)
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log('=== new values ===')
            console.log(values)
        }

        const newValue: Record<string, any> = {
            name: values.name,
            birthday: values.birthday,
            highFever: values.highFever,
            premature: values.premature,
            deliveryProblems: values.deliveryProblems,
            lowWeight: values.lowWeight,
            deliveryType: values.deliveryType,
            deliveryProblemsTypes: values.deliveryProblemsTypes.join(" "),
            brothersNumber: Number(values.brothersNumber),
            consultType: values.consultType,
        }

        // Inclui TALE se aceito
        if (taleRequired && taleAccepted && taleDocumentId) {
            newValue.tale_document_id = taleDocumentId
            newValue.tale_accepted = true
        }

        const result = await trigger(newValue)

        if (error) {
            return <ErrorPage type="user"></ErrorPage>
        }

        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log(data);
        }
        if (result && !error) {
            setSubmitting(false)
            navigate(`/user/registers/create-register/${result.data.id}/first_time`);
        } else {
            setSubmitting(false)
            if (import.meta.env.VITE_DEV_MODE === 'true') {
                console.error('Erro ao enviar dados:', error);
            }
        }
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.log('=== result ===')
            console.log(result)
        }
    }

    return (
        <div className="min-h-screen h-full relative bg-[#A0E7E5]">
            <ToyBackground />

            <div className="min-h-screen h-full flex flex-col relative z-10">

                {/* Header */}
                <div className="px-6 pb-4 flex items-center gap-4" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)' }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:bg-gray-100/50 p-2 rounded-lg transition-colors"
                        disabled={submitting}
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Cadastro da Criança</h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="min-h-full p-6 pb-20">
                        <div className="w-full max-w-md md:max-w-4xl mx-auto">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                                    {/* ── Campos essenciais (sempre exibidos) ─────────────────── */}
                                    <Card className='bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-3xl'>
                                        <CardContent className='space-y-3 p-4'>

                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className='font-bold'>Nome completo da criança*</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Nome da criança" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="birthday"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Data de nascimento*</FormLabel>
                                                        <DatePicker
                                                            field={field}
                                                            disabled={(date) => {
                                                                const today = startOfDay(new Date());
                                                                return (isBefore(date, new Date("1900-01-01")) || isAfter(date, today));
                                                            }}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="brothers"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ToggleField
                                                                label="Tem irmãos?"
                                                                value={field.value}
                                                                onChange={(checked) => {
                                                                    field.onChange(checked);
                                                                    if (!checked) {
                                                                        form.setValue("brothersNumber", "");
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            {form.watch('brothers') && (
                                                <FormField
                                                    control={form.control}
                                                    name="brothersNumber"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='font-bold'>Número de irmãos</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" placeholder="Número de irmãos" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* ============================================================
                                        BLOCO DE PESQUISA — exibido apenas para participantes
                                        Para remover: apagar daqui até "fim do bloco de pesquisa"
                                        ============================================================ */}
                                    {participatesInResearch && (
                                        <div className="space-y-5">
                                            {/* Label identificador do bloco */}
                                            <div className="flex items-center gap-2 px-1">
                                                <div className="h-px flex-1 bg-cyan-300/60" />
                                                <span className="text-xs font-bold text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full">🔬 Dados para a pesquisa</span>
                                                <div className="h-px flex-1 bg-cyan-300/60" />
                                            </div>

                                            {/* Banner: documento TALE não configurado */}
                                            {taleMissingDoc && (
                                                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                                                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold text-red-800 text-sm">Documento TALE Indisponível</p>
                                                        <p className="text-xs text-red-700 mt-0.5">
                                                            O Termo de Assentimento para essa faixa etária ainda não foi configurado no sistema.
                                                            O cadastro desta criança está temporariamente bloqueado. Tente novamente mais tarde.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <Card className='bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-3xl'>
                                                <CardContent className='space-y-3 p-4'>
                                                    <FormField
                                                        control={form.control}
                                                        name="deliveryProblems"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <ToggleField
                                                                        label="A mãe teve problemas durante a gravidez?"
                                                                        value={field.value}
                                                                        onChange={(checked) => {
                                                                            field.onChange(checked);
                                                                            if (!checked) {
                                                                                form.setValue("deliveryProblemsTypes", []);
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    {form.watch('deliveryProblems') && (<FormField
                                                        control={form.control}
                                                        name="deliveryProblemsTypes"
                                                        render={() => (
                                                            <FormItem >

                                                                <Accordion type="single" collapsible className="border-none">
                                                                    <AccordionItem value="item-1" className="border-none">
                                                                        <AccordionTrigger className='hover:no-underline text-sm font-semibold text-gray-600 py-3 px-4 bg-gray-50 rounded-xl mb-2'>Quais problemas?</AccordionTrigger>
                                                                        <AccordionContent className='space-y-3 pt-2 pb-1'>

                                                                            {deliveryProblems.map((item) => (
                                                                                <FormField
                                                                                    key={item.id}
                                                                                    control={form.control}
                                                                                    name="deliveryProblemsTypes"
                                                                                    render={({ field }) => {
                                                                                        return (

                                                                                            <FormItem
                                                                                                key={item.id}
                                                                                                className="flex flex-row items-center space-x-3 space-y-0 p-3 bg-white rounded-xl border border-gray-100 hover:border-[#A0E7E5]/50 transition-colors"
                                                                                            >
                                                                                                <FormControl>
                                                                                                    <Checkbox
                                                                                                        checked={field.value?.includes(item.id)}
                                                                                                        onCheckedChange={(checked) => {
                                                                                                            return checked
                                                                                                                ? field.onChange([...field.value, item.id])
                                                                                                                : field.onChange(
                                                                                                                    field.value?.filter(
                                                                                                                        (value) => value !== item.id
                                                                                                                    )
                                                                                                                )

                                                                                                        }}
                                                                                                    />
                                                                                                </FormControl>
                                                                                                <FormLabel className="font-medium text-gray-700 cursor-pointer flex-1">
                                                                                                    {item.label}
                                                                                                </FormLabel>
                                                                                            </FormItem>
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                </Accordion>

                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />)}
                                                    <FormField
                                                        control={form.control}
                                                        name="premature"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <ToggleField
                                                                        label="Teve parto prematuro? (antes de 37 semanas)"
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="deliveryType"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <ToggleField
                                                                        label="Tipo de parto: Normal?"
                                                                        value={field.value === "normal"}
                                                                        onChange={(checked) => {
                                                                            if (checked) {
                                                                                form.setValue("deliveryType", "normal");
                                                                            } else {
                                                                                form.setValue("deliveryType", "cesarean");
                                                                            }
                                                                            if (import.meta.env.VITE_DEV_MODE === 'true') {
                                                                                console.log(form.watch("deliveryType"));
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="lowWeight"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <ToggleField
                                                                        label="Baixo peso ao nascer? (abaixo de 2,5kg)"
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </CardContent>
                                            </Card>

                                            <Card className='bg-white/95 backdrop-blur-sm border-none shadow-xl rounded-3xl'>
                                                <CardContent className='space-y-3 p-4'>

                                                    <FormField
                                                        control={form.control}
                                                        name="highFever"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <ToggleField
                                                                        label="Já teve febre alta ou infecção até os 3 anos?"
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="consultDentist"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <ToggleField
                                                                        label="Já teve consulta com dentista?"
                                                                        value={field.value}
                                                                        onChange={(checked) => {
                                                                            field.onChange(checked);
                                                                            if (!checked) {
                                                                                form.setValue("consultType", "");
                                                                            }
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    {form.watch('consultDentist') && (<FormField
                                                        control={form.control}
                                                        name="consultType"
                                                        render={({ field }) => (
                                                            <FormItem >
                                                                <FormLabel className='font-bold'>Tipo de consulta</FormLabel>
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

                                                </CardContent>
                                            </Card>

                                            {/* ── Card TALE — exibido apenas para crianças de 6-12 anos ── */}

                                            {/* Estado de carregamento do documento TALE */}
                                            {taleType && taleDocsLoading && (
                                                <div className="w-full bg-white/95 backdrop-blur-sm p-5 rounded-3xl shadow-xl border-2 border-gray-200 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm text-gray-400">Carregando TALE…</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">Buscando documento de assentimento</p>
                                                    </div>
                                                </div>
                                            )}

                                            {taleType && !taleDocsLoading && (
                                                <FormField
                                                    control={form.control}
                                                    name="accept_tale"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <button
                                                                    type="button"
                                                                    disabled={!taleDocumentId}
                                                                    onClick={() => {
                                                                        if (!taleUnlocked) setTaleModalOpen(true);
                                                                        else {
                                                                            const newVal = !taleAccepted
                                                                            setTaleAccepted(newVal)
                                                                            field.onChange(newVal)
                                                                        }
                                                                    }}
                                                                    className={`w-full text-left bg-white/95 backdrop-blur-sm p-5 md:p-6 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 border-2 transition-all active:scale-[0.99] ${taleAccepted
                                                                        ? 'border-[#2A9D8F] bg-[#f0fdfb]/95'
                                                                        : taleUnlocked
                                                                            ? 'border-gray-200 hover:border-[#A0E7E5]'
                                                                            : 'border-gray-200 hover:border-amber-300'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${taleAccepted ? 'bg-[#2A9D8F]' : taleUnlocked ? 'bg-gray-100' : 'bg-amber-50'}`}>
                                                                            {taleAccepted ? (
                                                                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                                            ) : taleUnlocked ? (
                                                                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="3" /></svg>
                                                                            ) : (
                                                                                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className={`font-semibold text-sm leading-tight ${taleAccepted ? 'text-[#2A9D8F]' : 'text-gray-800'}`}>
                                                                                Li e aceito o TALE*
                                                                                <span className="ml-1 text-xs font-normal text-gray-400">
                                                                                    {taleType === 'tale_6_9' ? '(6–9 anos)' : '(10–12 anos)'}
                                                                                </span>
                                                                            </p>
                                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                                {taleAccepted
                                                                                    ? 'Aceite confirmado. Clique para desmarcar.'
                                                                                    : taleUnlocked
                                                                                        ? 'Clique para confirmar o aceite'
                                                                                        : !taleDocumentId
                                                                                            ? 'Documento TALE não disponível no sistema'
                                                                                            : 'Clique para ler o Termo de Assentimento'}
                                                                            </p>
                                                                        </div>
                                                                        {taleUnlocked && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => { e.stopPropagation(); setTaleModalOpen(true); }}
                                                                                className="text-xs font-medium text-[#2A9D8F] hover:text-[#2A9D8F]/80 underline ml-2 px-2 py-1 flex-shrink-0"
                                                                            >
                                                                                Ler novamente
                                                                            </button>
                                                                        )}
                                                                        {!taleUnlocked && (
                                                                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            </FormControl>
                                                            {taleBlocksSubmit && (
                                                                <p className="text-xs text-red-500 px-1 pt-1">
                                                                    O TALE é obrigatório para crianças participantes da pesquisa nessa faixa etária.
                                                                </p>
                                                            )}
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    )} {/* fim do bloco de pesquisa */}
                                    {/* ============================================================ */}

                                    <div className="flex justify-center pt-2">
                                        <Button
                                            className="w-full md:w-auto md:min-w-[200px]"
                                            type="submit"
                                            disabled={submitting || taleBlocksSubmit || taleMissingDoc}
                                        >
                                            Salvar Cadastro
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal TALE */}
            {taleType && (
                <TcleModalSecure
                    open={taleModalOpen}
                    onOpenChange={setTaleModalOpen}
                    onAccept={(accepted) => {
                        if (accepted) {
                            setTaleUnlocked(true)
                            setTaleAccepted(true)
                            form.setValue('accept_tale', true)
                            setTaleModalOpen(false)
                        }
                    }}
                    documentType={taleType}
                    presignedUrl={talePresignedUrl || undefined}
                    isAlreadyUnlocked={taleUnlocked}
                />
            )}
        </div>
    )

}