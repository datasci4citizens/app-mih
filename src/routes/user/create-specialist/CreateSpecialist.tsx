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

import ErrorPage from '@/lib/components_utils/ErrorPage';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import useSwrMutation from 'swr/mutation';
import apiClient from '@/lib/axios';
import imgTooth from '@/assets/Icon.svg';
import { useState } from 'react';

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
});

async function sendRequest(
	url: string,
	{ arg }: { arg: { role: string; name: string; email: string; phone_number: string } },
) {
	return await apiClient.put(url, arg);
}

export default function CreateSpecialist() {
	const { trigger, data, error, isMutating } = useSwrMutation(
		`${import.meta.env.VITE_SERVER_URL}/users/`,
		sendRequest,
	);
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			phone_number: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setSubmitting(true);
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
				await mutate('/user/me', undefined, { revalidate: true });
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
					Cadastro Especialista
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
												className="border-gray-300 focus:border-[#A0E7E5] focus:ring-[#A0E7E5]/20"
											/>
										</FormControl>
										<FormDescription className="text-xs">
											Insira o email usado no login com o Google
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
		</div>
	);
}
