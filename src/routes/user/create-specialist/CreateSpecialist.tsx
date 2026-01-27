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
import { ChevronLeft } from 'lucide-react';

import ErrorPage from '@/lib/components_utils/ErrorPage';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import useSwrMutation from 'swr/mutation';
import apiClient from '@/lib/axios';
import { useState, useEffect } from 'react';
import { useUser } from '@/lib/hooks/use-user';

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
	const user = useUser();
	const { trigger, data, error, isMutating } = useSwrMutation(
		`${import.meta.env.VITE_SERVER_URL}/users/`,
		sendRequest,
	);
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user.name || '',
			email: user.email || '',
			phone_number: '',
		},
	});

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
		</div>
	);
}
