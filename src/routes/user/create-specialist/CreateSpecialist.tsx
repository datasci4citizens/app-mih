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
import { ToyBackground } from '@/components/ui/toy-background';
import { ChevronLeft, AlertCircle } from 'lucide-react';

import ErrorPage from '@/lib/components_utils/ErrorPage';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import useSwrMutation from 'swr/mutation';
import apiClient from '@/lib/axios';
import { useState, useCallback, useEffect } from 'react';
import { useUser } from '@/lib/hooks/use-user';
import { TcleModalSecure } from '@/components/ui/tcle-modal-secure';
import { useConsentModals } from '@/lib/hooks/useConsentModals';
import type { ConsentDocumentReference } from '@/types/consent.types';

const documentSchema = z.object({
	id: z.number().optional(),
	hash: z.string().optional(),
}).optional();

const formSchema = z.object({
	name: z.string().min(4, {
		message: 'Nome muito pequeno.',
	}),
	phone_number: z.string().min(11, {
		message: 'O telefone deve ter no mínimo 11 dígitos.',
	}),
	email: z.string().email({
		message: 'E-mail inválido.',
	}),
	accept_privacy_policy: z.boolean().refine((val) => val === true, {
		message: 'É necessário que concorde com a Política de Privacidade para avançar.',
	}),
	privacy_policy_document: documentSchema,
});

async function sendRequest(
	url: string,
	{ arg }: { arg: any },
) {
	return await apiClient.put(url, arg);
}

export default function CreateSpecialist() {
	const user = useUser();
	const { trigger, data, error, isMutating } = useSwrMutation(
		`/users/`,
		sendRequest,
	);
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const { privacy, setPrivacyOpen, setPrivacyUnlocked, getPrivacyDocId, docsLoading } = useConsentModals();
	const isMissingPrivacy = privacy.documentId === null;
	const isMissingDocuments = !docsLoading && isMissingPrivacy;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user.name || '',
			email: user.email || '',
			phone_number: '',
			accept_privacy_policy: false,
			privacy_policy_document: undefined,
		},
	});

	const handlePrivacyAccepted = useCallback((accepted: boolean) => {
		if (accepted) {
			setPrivacyOpen(false);
			const docId = getPrivacyDocId();
			form.setValue('accept_privacy_policy', true);
			if (docId) {
				form.setValue('privacy_policy_document', { id: docId });
			}
			setPrivacyUnlocked(true);
		}
	}, [form, getPrivacyDocId, setPrivacyOpen, setPrivacyUnlocked]);

	// Update form values if user data loads after initial render
	useEffect(() => {
		if (user.email) {
			form.setValue('email', user.email);
		}
		if (user.name) {
			// Only set name if it's empty to allow user editing if they started typing/or if we want to force it initially
			// But simpler to just reset/setValue if the user context updates. 
			// Let's rely on defaultValues for initial mount if data is present, 
			// and this effect for async updates.
			if (form.getValues('name') === '') {
				form.setValue('name', user.name);
			}
		}
	}, [user, form]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setSubmitting(true);

		if (values.accept_privacy_policy && !values.privacy_policy_document?.id) {
			const privacyId = getPrivacyDocId();
			if (privacyId) values.privacy_policy_document = { id: privacyId };
		}

		if (import.meta.env.VITE_DEV_MODE === 'true') {
			console.log('=== new values ===');
			console.log(values);
		}

		const newValue = { ...values, is_allowed: false, role: 'specialist' };
		if (import.meta.env.VITE_DEV_MODE === 'true') {
			console.log(newValue);
		}
		const result = await trigger(newValue);

		if (import.meta.env.VITE_DEV_MODE === 'true') {
			console.log(error);
		}
		if (error) {
			setSubmitting(false);
			return <ErrorPage type="user"></ErrorPage>;
		}
		if (import.meta.env.VITE_DEV_MODE === 'true') {
			console.log('=== result ===');
			console.log(result);
			console.log(data);
			console.log(error);
		}
		if (!isMutating && !error) {
			if (result) {
				await mutate('/user/me/', undefined, { revalidate: true });
				setSubmitting(false);
				navigate(`/specialist/home`);
			} else {
				setSubmitting(false);
				if (import.meta.env.VITE_DEV_MODE === 'true') {
					console.error('Erro ao enviar dados:', error);
				}
			}
		}
	}

	return (
		<div className="w-full min-h-screen bg-[#A0E7E5] relative">
			<ToyBackground />
			<div className="relative z-10 flex flex-col min-h-screen" style={{ paddingTop: 'max(env(safe-area-inset-top), 1.5rem)', paddingBottom: '3rem' }}>
				{/* Header with Back Button */}
				<div className="px-6 pb-6 flex items-center gap-4">
					<button
						onClick={() => navigate(-1)}
						className="bg-white/40 hover:bg-white/60 text-gray-700 rounded-full h-12 w-12 border border-white/50 backdrop-blur-md shadow-lg transition-colors flex items-center justify-center"
					>
						<ChevronLeft size={24} />
					</button>
					<h1 className="text-2xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
						Cadastro Especialista
					</h1>
				</div>

				{/* Content */}
				<div className="flex-1 flex flex-col items-center px-6">

					{/* Main Form Card */}
					<div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
								{/* Name Field */}
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-bold text-gray-700">
												Nome completo*
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Nome completo"
													{...field}
													className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
												/>
											</FormControl>
											<FormDescription className="text-xs">
												Insira o seu nome completo
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Email Field */}
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-bold text-gray-700">E-mail*</FormLabel>
											<FormControl>
												<Input
													placeholder="Email de cadastro"
													{...field}
													disabled={true}
													className="border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed focus:border-gray-300 focus:ring-0"
												/>
											</FormControl>
											<FormDescription className="text-xs">
												Email vinculado à sua conta Google
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Phone Field */}
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
													placeholder="Telefone"
													{...field}
													className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
												/>
											</FormControl>
											<FormDescription className="text-xs">
												Insira o telefone para contato
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Documentos não encontrados */}
								{isMissingDocuments && (
									<div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
										<AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
										<div>
											<p className="font-semibold text-red-800 text-sm">Documentos Indisponíveis</p>
											<p className="text-xs text-red-700 mt-0.5">
												A Política de Privacidade necessária para o cadastro ainda não foi configurada no sistema. 
												O acesso no momento está temporariamente bloqueado. Tente novamente mais tarde.
											</p>
										</div>
									</div>
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

								{/* Submit Button */}
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
			</div>

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
