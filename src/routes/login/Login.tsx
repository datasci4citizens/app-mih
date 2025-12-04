import toothLogo from '@/assets/Icon.svg';
import apiClient from '@/lib/axios';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
	const navigate = useNavigate();

	const login = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			try {
				await apiClient.post('/auth/login/google', {
					code: codeResponse.code,
				});

				navigate('/');
			} catch (error) {
				console.error('Erro ao logar:', error);
			}
		},
		flow: 'auth-code',
	});

	return <GoogleButton label="Entrar com o Google" onClick={() => login()} />;
};

const nativeGoogleLogin = async (navigate: (path: string) => void) => {
	try {
		console.log('trying to login');
		const login = await SocialLogin.login({
			provider: 'google',
			options: {
				scopes: ['email', 'profile'],
			},
		});

		const result = login.result;
		await apiClient.post('/auth/login/google/native', {
			code: (result as any).accessToken.token,
		});
		navigate('/');
	} catch (error) {
		console.error('Error during native Google login:', error);
	}
};

const NativeGoogleLoginButton = () => {
	const navigate = useNavigate();
	return (
		<GoogleButton
			label="Entrar com o Google (Nativo)"
			onClick={() => nativeGoogleLogin(navigate)}
		/>
	);
};

const LoginPage = () => {
	useEffect(() => {
		const initializeSocialLogin = async () => {
			console.log('initializing social login online please');
			await SocialLogin.initialize({
				google: {
					webClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
					mode: 'online',
				},
			});
		};
		initializeSocialLogin();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-primary">
			<h1 className="font-semibold text-3xl text-white">
				Faça login com o google
			</h1>
			<img
				src={toothLogo}
				alt="Logo medicamentos"
				className="w-64 h-64 object-contain"
			/>
			<h1 className="font-extrabold text-3xl text-white">MolarCheck</h1>
			<div className="mt-40">
				<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
					<GoogleLoginButton />
				</GoogleOAuthProvider>
				{Capacitor.getPlatform() === 'android' && (
					<div className="mt-4">
						<NativeGoogleLoginButton />
					</div>
				)}
			</div>
		</div>
	);
};

export default LoginPage;
