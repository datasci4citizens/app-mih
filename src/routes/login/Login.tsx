import toothLogo from '@/assets/Icon.svg';
import apiClient from '@/lib/axios';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';
import { ToyBackground } from '@/components/ui/toy-background';

// Content of the login page, without the login button logic
const LoginContent = ({ onLoginClick }: { onLoginClick: () => void }) => (
	<div className="w-full h-screen bg-[#A0E7E5] relative">
		<ToyBackground />
		<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
			{/* Logo */}
			<img
				src={toothLogo}
				alt="Logo Molar Check"
				className="w-32 h-32 md:w-40 md:h-40 object-contain mb-6 drop-shadow-lg animate-in fade-in duration-500"
			/>

			{/* App Title */}
			<h1
				className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
				style={{ fontFamily: 'Nunito, sans-serif' }}
			>
				Molar Check
			</h1>

			{/* Subtitle */}
			<p className="text-white text-opacity-90 text-base md:text-lg mb-10 text-center font-medium max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
				Monitoramento simplificado de HMI
			</p>

			{/* Login Card */}
			<div className="w-full max-w-sm bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
				<div className="text-center mb-4">
					<h2 className="text-xl font-bold text-gray-800 mb-1">Bem-vindo!</h2>
					<p className="text-sm text-gray-600">Faça login para continuar</p>
				</div>

				{/* Google Login Button */}
				<button
					onClick={onLoginClick}
					className="w-full transform transition-all duration-150 active:scale-95 hover:-translate-y-1 shadow-[0_4px_0_rgba(0,0,0,0.1)] active:shadow-[0_1px_0_rgba(0,0,0,0.1)] active:translate-y-1 rounded-2xl py-4 px-6 font-bold text-white flex items-center justify-center gap-3 bg-gradient-to-br from-[#FF8A65] to-[#FFB394]"
				>
					<svg className="w-6 h-6" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					<span className="text-lg font-semibold">Entrar com o Google</span>
				</button>
			</div>
		</div>
	</div>
);

const WebLogin = () => {
	const navigate = useNavigate();
	const login = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			if (import.meta.env.VITE_DEV_MODE === 'true') {
				console.log('response:', codeResponse);
			}
			try {
				// Troca o code do Google por dados do usuário + JWT diretamente
				const response = await apiClient.post('/auth/login/google/', {
					code: codeResponse.code,
				});
				if (import.meta.env.VITE_DEV_MODE === 'true') {
					console.log('Usuário logado:', response.data);
				}
				localStorage.setItem('access_token', response.data.access);
				localStorage.setItem('refresh_token', response.data.refresh);

				// Immediately put the user data in SWR cache so AuthGuard doesn't flash redirect
				mutate('/user/me/', response.data, false);

				navigate('/');
			} catch (error) {
				console.error('Erro ao logar:', error);
			}
		},
		flow: 'auth-code',
	});

	return <LoginContent onLoginClick={() => login()} />;
};

const NativeLogin = () => {
	const navigate = useNavigate();
	const nativeGoogleLogin = async () => {
		try {
			await SocialLogin.initialize({
				google: {
					webClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
					mode: 'online',
				},
			});

			if (import.meta.env.VITE_DEV_MODE === 'true') {
				console.log('trying to login');
			}
			const login = await SocialLogin.login({
				provider: 'google',
				options: {
					scopes: ['email', 'profile'],
				},
			});
			if (import.meta.env.VITE_DEV_MODE === 'true') {
				console.log('Native Google Login Result:', JSON.stringify(login));
			}

			const result = login.result;
			if (import.meta.env.VITE_DEV_MODE === 'true') {
				console.log('result ', result);
			}
			// Troca o access_token do Google por dados do usuário + JWT diretamente
			const response = await apiClient.post('/auth/login/google/native/', {
				code: (result as any).accessToken.token,
			});
			if (import.meta.env.VITE_DEV_MODE === 'true') {
				console.log('Usuário logado nativamente:', response.data);
			}
			localStorage.setItem('access_token', response.data.access);
			localStorage.setItem('refresh_token', response.data.refresh);

			// Immediately put the user data in SWR cache so AuthGuard doesn't flash redirect
			mutate('/user/me/', response.data, false);

			navigate('/');
		} catch (error) {
			console.error('Error during native Google login:', error);
		}
	};

	return <LoginContent onLoginClick={nativeGoogleLogin} />;
};

const LoginPage = () => {
	const platform = Capacitor.getPlatform();

	if (platform === 'web') {
		return (
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
				<WebLogin />
			</GoogleOAuthProvider>
		);
	}

	return <NativeLogin />;
};

export default LoginPage;
