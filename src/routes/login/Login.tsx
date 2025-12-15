import toothLogo from '@/assets/Icon.svg';
import apiClient from '@/lib/axios';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import GoogleButton from 'react-google-button';
import { useNavigate } from 'react-router-dom';

// Content of the login page, without the login button logic
const LoginContent = ({ onLoginClick }: { onLoginClick: () => void }) => (
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
			<GoogleButton label="Entrar com o Google" onClick={onLoginClick} />
		</div>
	</div>
);

const WebLogin = () => {
	const navigate = useNavigate();
	const login = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			//console.log('response:', codeResponse);
			try {
				const response = await apiClient.post('/auth/login/google', {
					code: codeResponse.code,
				});
				//console.log('Usuário logado:', response.data);
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

			console.log('trying to login');
			const login = await SocialLogin.login({
				provider: 'google',
				options: {
					scopes: ['email', 'profile'],
				},
			});
			//console.log('Native Google Login Result:', JSON.stringify(login));

			const result = login.result;
			//console.log('result ', result);
			const response = await apiClient.post('/auth/login/google/native', {
				code: (result as any).accessToken.token,
			});
			//console.log('Usuário logado nativamente:', response.data);
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
