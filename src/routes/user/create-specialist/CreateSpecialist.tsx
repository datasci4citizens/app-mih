import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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

import ErrorPage from '@/lib/components_utils/ErrorPage';
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
	email: z.string(),
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
		console.log('=== new values ===');
		console.log(values);

		const newValue = { ...values, is_allowed: false, role: 'specialist' };
		console.log(newValue);
		const result = await trigger(newValue);

		console.log(error);
		if (error) {
			return <ErrorPage type="user"></ErrorPage>;
		}
		console.log('=== result ===');
		console.log(result);
		console.log(data);
		console.log(error);
		if (!isMutating) {
			if (result && !error) {
				await mutate('/user/me', undefined, { revalidate: true });
				navigate(`/specialist/home`); // Redireciona para a home
			} else {
				console.error('Erro ao enviar dados:', error);
			}
		}
	}

	return (
		<div>
			<div className="bg-[#0C4A6E] h-32 w-full"></div>

			<div className="flex min-h-screen items-center justify-center rounded-t-3xl -mt-16 bg-white">
				<Card className="w-[90%] border-none overflow-auto max-h-screen">
					<CardHeader>
						<CardTitle className="text-center font-extrabold">
							Complete o seu cadastro
						</CardTitle>
					</CardHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-3 mb-20"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome completo</FormLabel>
										<FormControl>
											<Input placeholder="Nome" {...field} />
										</FormControl>
										<FormDescription>
											Insira o seu nome completo
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>E-mail</FormLabel>
										<FormControl>
											<Input placeholder="Email de cadastro" {...field} />
										</FormControl>
										<FormDescription>
											Insira o email usado no login com o google
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Numero de telefone</FormLabel>
										<FormControl>
											<Input placeholder="Telefone" {...field} />
										</FormControl>
										<FormDescription>
											Insira o telefone para contato
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button className=" w-[100%]" type="submit">
								Próximo
							</Button>
						</form>
					</Form>
				</Card>
			</div>
		</div>
	);
}
