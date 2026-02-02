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
import { ToyBackground } from '@/components/ui/toy-background';
import { TcleModal } from '@/components/ui/tcle-modal';
import { Info, ChevronLeft } from 'lucide-react';

import ErrorPage from '@/lib/components_utils/ErrorPage';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import useSwrMutation from 'swr/mutation';
import apiClient from '@/lib/axios';

const formSchema = z.object({
	name: z.string().min(4, {
		message: 'Nome muito pequeno.',
	}),
	phone_number: z.string().min(11, {
		message: 'O telefone deve ter no mínimo 11 dígitos.',
	}),
	state: z.string().min(2, {
		message: 'O Estado deve ter no mínimo 2 dígitos.',
	}),
	city: z.string().min(2, {
		message: 'A cidade deve ter no mínimo 2 dígitos.',
	}),
	neighborhood: z.string().min(2, {
		message: 'O Bairro deve ter no mínimo 2 dígitos.',
	}),
	accept_tcle: z.boolean().refine((val) => val === true, {
		message: 'É necessário que concorde com os termos para avançar.',
	}),
});

async function sendRequest(
	url: string,
	{
		arg,
	}: {
		arg: {
			name: string;
			phone_number: string;
			role: string;
			state: string;
			city: string;
			neighborhood: string;
			accept_tcle: boolean;
		};
	},
) {
	return await apiClient.put(url, arg);
}

export default function CreateUser() {
	const { trigger, error } = useSwrMutation(
		`${import.meta.env.VITE_SERVER_URL}/users/`,
		sendRequest,
	);
	const [submitting, setSubmitting] = useState(false);
	const [showTcleModal, setShowTcleModal] = useState(false);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			phone_number: '',
			state: '',
			city: '',
			neighborhood: '',
			accept_tcle: false,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setSubmitting(true);
		const newValues = { ...values, role: 'responsible' };
		const result = await trigger(newValues);

		if (error) {
			return <ErrorPage type="user"></ErrorPage>;
		}

		if (result && !error) {
			await mutate('/user/me');
			setSubmitting(false);
			navigate(`/user/home`);
		} else {
			setSubmitting(false);
			if (import.meta.env.VITE_DEV_MODE === 'true') {
				console.error('Erro ao enviar dados:', error);
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
						Cadastro Responsável
					</h1>
				</div>

				{/* Content */}
				<div className="flex-1 flex flex-col items-center px-6">

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-6">
							{/* Card 1: Form Fields (White Background) */}
							<div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-5">
								{/* Name Field */}
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
													placeholder="Nome do responsável"
													{...field}
													className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
												/>
											</FormControl>
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

								{/* Location Fields - Grid */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{/* State Field */}
									<FormField
										control={form.control}
										name="state"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="font-bold text-gray-700">Estado*</FormLabel>
												<FormControl>
													<Input
														placeholder="Estado"
														{...field}
														className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* City Field */}
									<FormField
										control={form.control}
										name="city"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="font-bold text-gray-700">Cidade*</FormLabel>
												<FormControl>
													<Input
														placeholder="Cidade"
														{...field}
														className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Neighborhood Field */}
									<FormField
										control={form.control}
										name="neighborhood"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="font-bold text-gray-700">Bairro*</FormLabel>
												<FormControl>
													<Input
														placeholder="Bairro"
														{...field}
														className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							{/* Card 2: Research Information (Blue Background) */}
							<div className="bg-gradient-to-br from-cyan-400 to-cyan-500 p-6 md:p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
								<div className="flex items-start gap-3">
									<Info className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
									<div className="flex-1">
										<h3 className="font-bold text-white mb-3 text-lg">
											Convite para Participação em Pesquisa
										</h3>
										<p className="text-sm text-white leading-relaxed">
											Você é convidado(a) a participar de uma pesquisa científica
											desenvolvida por Dentistas da <strong>FOP - Unicamp</strong> para
											melhorar o tratamento de HMI.
										</p>
										<p className="text-sm text-white leading-relaxed mt-3">
											Caso concorde, coletaremos dados de forma <strong>anônima</strong> sobre
											o uso da plataforma. Seus dados pessoais (nome, e-mail, telefone)
											<strong> não serão armazenados</strong> para a pesquisa.
										</p>
										<p className="text-sm font-semibold text-white mt-4">
											✨ Participe, você ajudará a criar uma plataforma sempre melhor!
										</p>
									</div>
								</div>
							</div>

							{/* Card 3: TCLE Acceptance (White Background) */}
							<div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
								<FormField
									control={form.control}
									name="accept_tcle"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
													className="mt-0.5"
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel className="font-semibold text-gray-800">
													Li e aceito os termos TCLE
												</FormLabel>
												<FormDescription className="text-xs">
													<button
														type="button"
														onClick={() => setShowTcleModal(true)}
														className="text-[#FF8A65] hover:text-[#FF8A65]/80 font-medium underline"
													>
														Ver TCLE completo
													</button>
												</FormDescription>
												<FormMessage />
											</div>
										</FormItem>
									)}
								/>
							</div>

							{/* Submit Button - No background */}
							<Button
								className="w-full transform transition-all duration-150 active:scale-95 hover:-translate-y-1 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-[0_1px_0_rgba(0,0,0,0.1)] active:translate-y-1 rounded-2xl py-6 font-bold text-white text-lg bg-gradient-to-br from-[#FF8A65] to-[#FFB394]"
								type="submit"
								disabled={submitting}
							>
								{submitting ? 'Enviando...' : 'Próximo'}
							</Button>
						</form>
					</Form>
				</div>

				{/* TCLE Modal */}
				<TcleModal open={showTcleModal} onOpenChange={setShowTcleModal} />
			</div>
		</div>
	);
}
