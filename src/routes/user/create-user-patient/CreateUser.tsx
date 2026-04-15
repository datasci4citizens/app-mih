import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ToyBackground } from '@/components/ui/toy-background';
import { TcleModalSecure } from '@/components/ui/tcle-modal-secure';
import { ChevronLeft, FlaskConical, EyeOff, AlertCircle } from 'lucide-react';

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import useSwrMutation from 'swr/mutation';
import apiClient from '@/lib/axios';
import { useConsentModals } from '@/lib/hooks/useConsentModals';
import type { ConsentDocumentReference } from '@/types/consent.types';

// ──────────────────────────────────────────────────────────────────────────────
// SCHEMAS
// ──────────────────────────────────────────────────────────────────────────────

const documentSchema = z.object({
	id: z.number().optional(),
	hash: z.string().optional(),
}).optional();

const researchSchema = z.object({
	name: z.string().min(4, { message: 'Nome muito pequeno.' }),
	accept_tcle: z.boolean().refine((val) => val === true, {
		message: 'É necessário que concorde com os termos do TCLE para avançar.',
	}),
	tcle_document: documentSchema,
	accept_privacy_policy: z.boolean().refine((val) => val === true, {
		message: 'É necessário que concorde com a Política de Privacidade para avançar.',
	}),
	privacy_policy_document: documentSchema,
	phone_number: z.string().min(11, {
		message: 'O telefone deve ter no mínimo 11 dígitos.',
	}),
	state: z.string().min(2, { message: 'O Estado deve ter no mínimo 2 caracteres.' }),
	city: z.string().min(2, { message: 'A cidade deve ter no mínimo 2 caracteres.' }),
	neighborhood: z.string().min(2, { message: 'O Bairro deve ter no mínimo 2 caracteres.' }),
});

const noResearchSchema = z.object({
	name: z.string().min(4, { message: 'Nome muito pequeno.' }),
	accept_tcle: z.boolean().optional(),
	tcle_document: documentSchema,
	accept_privacy_policy: z.boolean().refine((val) => val === true, {
		message: 'É necessário que concorde com a Política de Privacidade para avançar.',
	}),
	privacy_policy_document: documentSchema,
	phone_number: z.string().optional(),
	state: z.string().optional(),
	city: z.string().optional(),
	neighborhood: z.string().optional(),
});

type ResearchFormValues = z.infer<typeof researchSchema>;
type NoResearchFormValues = z.infer<typeof noResearchSchema>;
type FormValues = ResearchFormValues | NoResearchFormValues;

// ──────────────────────────────────────────────────────────────────────────────
// API REQUEST
// ──────────────────────────────────────────────────────────────────────────────

async function sendRequest(
	url: string,
	{ arg }: { arg: any },
) {
	return await apiClient.put(url, arg);
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ──────────────────────────────────────────────────────────────────────────────

export default function CreateUser() {
	const navigate = useNavigate();
	const { trigger, error } = useSwrMutation(`/users/`, sendRequest);

	// Estados do componente
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [participatesInResearch, setParticipatesInResearch] = useState(false);

	// Hook customizado para gerenciar modais de consentimento
	const { tcle, privacy, setTcleOpen, setPrivacyOpen, setTcleUnlocked, setPrivacyUnlocked, getTcleDocId, getPrivacyDocId, docsLoading } = useConsentModals();

	const isMissingTcle = participatesInResearch ? tcle.documentId === null : false;
	const isMissingPrivacy = privacy.documentId === null;
	const isMissingDocuments = !docsLoading && (isMissingTcle || isMissingPrivacy);

	// Form
	const activeSchema = participatesInResearch ? researchSchema : noResearchSchema;
	const form = useForm<FormValues>({
		resolver: zodResolver(activeSchema),
		defaultValues: {
			name: '',
			phone_number: '',
			state: '',
			city: '',
			neighborhood: '',
			accept_tcle: false,
			tcle_document: undefined,
			accept_privacy_policy: false,
			privacy_policy_document: undefined,
		},
	});

	// Quando usuário alterna participação em pesquisa
	const handleResearchToggle = useCallback((value: boolean) => {
		setParticipatesInResearch(value);
		if (!value) {
			form.setValue('accept_tcle', false);
			form.setValue('tcle_document', undefined);
			form.setValue('phone_number', '');
			form.setValue('state', '');
			form.setValue('city', '');
			form.setValue('neighborhood', '');
			form.clearErrors(['accept_tcle', 'phone_number', 'state', 'city', 'neighborhood']);
		}
	}, [form]);

	// Quando usuário aceita TCLE
	const handleTcleAccepted = useCallback((accepted: boolean) => {
		if (accepted) {
			// Desbloqueia o checkbox no form
			setTcleOpen(false);
			const docId = getTcleDocId();
			form.setValue('accept_tcle', true);
			if (docId) {
				form.setValue('tcle_document', { id: docId });
			}
			// Marca como desbloqueado para liberar o checkbox
			setTcleUnlocked(true);
		}
	}, [form, getTcleDocId, setTcleOpen]);

	// Quando usuário aceita Política de Privacidade
	const handlePrivacyAccepted = useCallback((accepted: boolean) => {
		if (accepted) {
			// Desbloqueia o checkbox no form
			setPrivacyOpen(false);
			const docId = getPrivacyDocId();
			form.setValue('accept_privacy_policy', true);
			if (docId) {
				form.setValue('privacy_policy_document', { id: docId });
			}
			// Marca como desbloqueado para liberar o checkbox
			setPrivacyUnlocked(true);
		}
	}, [form, getPrivacyDocId, setPrivacyOpen]);

	const onSubmit = useCallback(async (values: FormValues) => {
		setSubmitting(true);
		setSubmitError(null);

		// Garantir que os IDs de consentimento não foram perdidos (race condition com o SWR)
		if (values.accept_privacy_policy && !values.privacy_policy_document?.id) {
			const privacyId = getPrivacyDocId();
			if (privacyId) values.privacy_policy_document = { id: privacyId };
		}
		if (participatesInResearch && values.accept_tcle && !values.tcle_document?.id) {
			const tcleId = getTcleDocId();
			if (tcleId) values.tcle_document = { id: tcleId };
		}

		const payload = {
			...values,
			role: 'responsible',
			user_agent: navigator.userAgent,
		};

		// console.log('DEBUG: Submitting payload:', payload);
		// console.log('DEBUG: tcle unlocked?', tcle.isUnlocked, 'doc id:', getTcleDocId());
		// console.log('DEBUG: privacy unlocked?', privacy.isUnlocked, 'doc id:', getPrivacyDocId());

		const result = await trigger(payload);

		if (error) {
			setSubmitError(error?.message || 'Erro ao cadastrar usuário.');
			setSubmitting(false);
			return;
		}

		if (result && !error) {
			await mutate('/user/me/');
			navigate(`/user/home`);
		} else {
			setSubmitting(false);
		}
	}, [trigger, error, navigate]);

	return (
		<div className="w-full min-h-screen bg-[#A0E7E5] relative">
			<ToyBackground />
			<div
				className="relative z-10 flex flex-col min-h-screen"
				style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)', paddingBottom: '3rem' }}
			>
				{/* Header */}
				<div className="px-6 pb-6 flex items-center gap-4">
					<button
						onClick={() => navigate(-1)}
						className="bg-white/40 hover:bg-white/60 text-gray-700 rounded-full h-12 w-12 border border-white/50 backdrop-blur-md shadow-lg transition-colors flex items-center justify-center"
					>
						<ChevronLeft size={24} />
					</button>
					<h1
						className="text-2xl font-bold text-white drop-shadow-lg"
						style={{ fontFamily: 'Nunito, sans-serif' }}
					>
						Cadastro Responsável
					</h1>
				</div>

				<div className="flex-1 flex flex-col items-center px-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-6">

							{/* Erro de submissão */}
							{submitError && (
								<div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
									<AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-red-800 text-sm">Erro ao cadastrar</p>
										<p className="text-xs text-red-700 mt-0.5">{submitError}</p>
									</div>
								</div>
							)}

							{/* Documentos não encontrados */}
							{isMissingDocuments && (
								<div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
									<AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-red-800 text-sm">Documentos Indisponíveis</p>
										<p className="text-xs text-red-700 mt-0.5">
											Os documentos legais necessários para o cadastro ainda não foram configurados no sistema. 
											O acesso no momento está temporariamente bloqueado. Tente novamente mais tarde.
										</p>
									</div>
								</div>
							)}

							{/* Card 1: Convite à pesquisa (toggle) */}
							<div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A0E7E5] to-[#2A9D8F] flex items-center justify-center flex-shrink-0 shadow-md">
										<FlaskConical size={22} className="text-white" />
									</div>
									<div className="flex-1">
										<p className="font-bold text-gray-800 text-base leading-tight">
											Participar da pesquisa FOP-Unicamp
										</p>
										<p className="text-xs text-gray-500 mt-1 leading-snug">
											Contribua com dados anônimos para melhorar o tratamento da HMI.
											Não afeta o uso normal do aplicativo.
										</p>
									</div>
									<Switch
										checked={participatesInResearch}
										onCheckedChange={handleResearchToggle}
										className="flex-shrink-0 mt-1"
									/>
								</div>

								{participatesInResearch && (
									<div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2">
										<EyeOff size={14} className="text-[#2A9D8F] flex-shrink-0 mt-0.5" />
										<p className="text-xs text-[#2A9D8F] font-medium">
											Seus dados pessoais (nome, e-mail, telefone) nunca serão associados
											aos dados de pesquisa, que são completamente anônimos.
										</p>
									</div>
								)}
							</div>

							{/* Card 2: Dados essenciais */}
							<div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-5">
								{/* Nome */}
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-bold text-gray-700">
												Nome do responsável*
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Nome completo"
													{...field}
													className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Campos extras apenas para participantes */}
								{participatesInResearch && (
									<>
										<FormField
											control={form.control}
											name="phone_number"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-bold text-gray-700">
														Número de telefone*
													</FormLabel>
													<FormControl>
														<Input
															placeholder="(XX) XXXXX-XXXX"
															{...field}
															className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
														/>
													</FormControl>
													<FormDescription className="text-xs">
														Para contato da equipe de pesquisa, se necessário
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<FormField
												control={form.control}
												name="state"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="font-bold text-gray-700">Estado*</FormLabel>
														<FormControl>
															<Input
																placeholder="SP"
																{...field}
																className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
															/>
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
														<FormLabel className="font-bold text-gray-700">Cidade*</FormLabel>
														<FormControl>
															<Input
																placeholder="Piracicaba"
																{...field}
																className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
															/>
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
														<FormLabel className="font-bold text-gray-700">Bairro*</FormLabel>
														<FormControl>
															<Input
																placeholder="Centro"
																{...field}
																className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</>
								)}
							</div>

							{/* Card 3: TCLE — apenas para participantes da pesquisa */}
							{participatesInResearch && (
								<FormField
									control={form.control}
									name="accept_tcle"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<button
													type="button"
													disabled={docsLoading || isMissingTcle}
													onClick={() => {
														if (!tcle.isUnlocked) setTcleOpen(true);
														else field.onChange(!field.value);
													}}
													className={`w-full text-left bg-white/95 backdrop-blur-sm p-5 md:p-6 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 border-2 transition-all active:scale-[0.99] ${field.value
															? 'border-[#2A9D8F] bg-[#f0fdfb]/95'
															: tcle.isUnlocked
																? 'border-gray-200 hover:border-[#A0E7E5]'
																: 'border-gray-200 hover:border-amber-300'
														}`}
												>
													<div className="flex items-center gap-4">
														<div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${field.value ? 'bg-[#2A9D8F]' : tcle.isUnlocked ? 'bg-gray-100' : 'bg-amber-50'
															}`}>
															{field.value ? (
																<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
															) : tcle.isUnlocked ? (
																<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="3" /></svg>
															) : (
																<svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
															)}
														</div>
														<div className="flex-1">
															<p className={`font-semibold text-sm leading-tight ${field.value ? 'text-[#2A9D8F]' : 'text-gray-800'}`}>
																Li e aceito o TCLE*
															</p>
															<p className="text-xs text-gray-500 mt-0.5">
																{field.value
																	? 'Aceite confirmado. Clique para desmarcar.'
																	: tcle.isUnlocked
																		? 'Clique para confirmar o aceite'
																		: 'Clique para ler o Termo de Consentimento'}
															</p>
														</div>
														{tcle.isUnlocked && (
															<button
																type="button"
																onClick={(e) => {
																	e.stopPropagation();
																	setTcleOpen(true);
																}}
																className="text-xs font-medium text-[#2A9D8F] hover:text-[#2A9D8F]/80 underline ml-2 px-2 py-1 flex-shrink-0"
															>
																Ler novamente
															</button>
														)}
														{!tcle.isUnlocked && (
															<svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
														)}
													</div>
												</button>
											</FormControl>
											<FormMessage className="px-1 pt-1" />
										</FormItem>
									)}
								/>
							)}

							{/* Card 4: Política de Privacidade — para todos */}
							<FormField
								control={form.control}
								name="accept_privacy_policy"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<button
												type="button"
												disabled={docsLoading || isMissingPrivacy}
												onClick={() => {
													if (!privacy.isUnlocked) setPrivacyOpen(true);
													else field.onChange(!field.value);
												}}
												className={`w-full text-left bg-white/95 backdrop-blur-sm p-5 md:p-6 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 border-2 transition-all active:scale-[0.99] ${field.value
														? 'border-[#2A9D8F] bg-[#f0fdfb]/95'
														: privacy.isUnlocked
															? 'border-gray-200 hover:border-[#A0E7E5]'
															: 'border-gray-200 hover:border-amber-300'
													}`}
											>
												<div className="flex items-center gap-4">
													<div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${field.value ? 'bg-[#2A9D8F]' : privacy.isUnlocked ? 'bg-gray-100' : 'bg-amber-50'
														}`}>
														{field.value ? (
															<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
														) : privacy.isUnlocked ? (
															<svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="3" /></svg>
														) : (
															<svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
														)}
													</div>
													<div className="flex-1">
														<p className={`font-semibold text-sm leading-tight ${field.value ? 'text-[#2A9D8F]' : 'text-gray-800'}`}>
															Li e aceito a Política de Privacidade*
														</p>
														<p className="text-xs text-gray-500 mt-0.5">
															{field.value
																? 'Aceite confirmado. Clique para desmarcar.'
																: privacy.isUnlocked
																	? 'Clique para confirmar o aceite'
																	: 'Clique para ler a Política de Privacidade'}
														</p>
													</div>
													{privacy.isUnlocked && (
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																setPrivacyOpen(true);
															}}
															className="text-xs font-medium text-[#2A9D8F] hover:text-[#2A9D8F]/80 underline ml-2 px-2 py-1 flex-shrink-0"
														>
															Ler novamente
														</button>
													)}
													{!privacy.isUnlocked && (
														<svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
													)}
												</div>
											</button>
										</FormControl>
										<FormMessage className="px-1 pt-1" />
									</FormItem>
								)}
							/>

							{/* Submit */}
							<Button
								className="w-full transform transition-all duration-150 active:scale-95 hover:-translate-y-1 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-[0_1px_0_rgba(0,0,0,0.1)] active:translate-y-1 rounded-2xl py-6 font-bold text-white text-lg bg-gradient-to-br from-[#FF8A65] to-[#FFB394]"
								type="submit"
								disabled={submitting || docsLoading || isMissingDocuments}
							>
								{docsLoading ? 'Carregando termo...' : submitting ? 'Enviando...' : 'Próximo'}
							</Button>
						</form>
					</Form>
				</div>
			</div>

			{/* TCLE Modal */}
			<TcleModalSecure
				open={tcle.isOpen}
				onOpenChange={setTcleOpen}
				onAccept={handleTcleAccepted}
				documentType="tcle"
				presignedUrl={tcle.presignedUrl || undefined}
				isAlreadyUnlocked={tcle.isUnlocked}
			/>

			{/* Política de Privacidade Modal */}
			<TcleModalSecure
				open={privacy.isOpen}
				onOpenChange={setPrivacyOpen}
				onAccept={handlePrivacyAccepted}
				documentType="privacy"
				presignedUrl={privacy.presignedUrl || undefined}
				isAlreadyUnlocked={privacy.isUnlocked}
			/>
		</div>
	);
}