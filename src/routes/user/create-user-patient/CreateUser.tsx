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
import { Info } from 'lucide-react';

import ErrorPage from '@/lib/components_utils/ErrorPage';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import useSwrMutation from 'swr/mutation';
import imgTooth from '@/assets/Icon.svg';

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
	return await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(arg),
	}).then((res) => res.json());
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
			console.error('Erro ao enviar dados:', error);
		}
	}

	return (
		<div className="w-full min-h-screen bg-[#A0E7E5] relative">
			<ToyBackground />
			<div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-6 py-12">
				{/* Logo */}
				<img
					src={imgTooth}
					alt="Logo Molar Check"
					className="w-24 h-24 md:w-32 md:h-32 object-contain mb-4 drop-shadow-lg animate-in fade-in duration-500"
				/>

				{/* App Title */}
				<h1
					className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight drop-shadow-lg text-center"
					style={{ fontFamily: 'Nunito, sans-serif' }}
				>
					Cadastro Responsável
				</h1>

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

							{/* TCLE Information Section */}
							<div className="bg-cyan-50 p-5 rounded-2xl border border-cyan-200 space-y-3">
								<div className="flex items-start gap-3">
									<Info className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
									<div className="flex-1">
										<h3 className="font-bold text-gray-800 mb-2">
											Convite para Participação em Pesquisa
										</h3>
										<p className="text-sm text-gray-700 leading-relaxed">
											Você é convidado(a) a participar de uma pesquisa científica
											desenvolvida por Dentistas da <strong>FOP - Unicamp</strong> para
											melhorar o tratamento de HMI.
										</p>
										<p className="text-sm text-gray-700 leading-relaxed mt-2">
											Caso concorde, coletaremos dados de forma <strong>anônima</strong> sobre
											o uso da plataforma. Seus dados pessoais (nome, e-mail, telefone)
											<strong> não serão armazenados</strong> para a pesquisa.
										</p>
										<p className="text-sm font-semibold text-cyan-700 mt-3">
											✨ Participe, você ajudará a criar uma plataforma sempre melhor!
										</p>
									</div>
								</div>
							</div>

							{/* TCLE Acceptance Checkbox */}
							<FormField
								control={form.control}
								name="accept_tcle"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-gray-200 rounded-xl">
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

							{/* Submit Button */}
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
			</div>

			{/* TCLE Modal */}
			<TcleModal open={showTcleModal} onOpenChange={setShowTcleModal} />
		</div>
	);
}
