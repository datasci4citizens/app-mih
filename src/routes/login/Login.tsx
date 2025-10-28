import GoogleButton from 'react-google-button';
import toothLogo from "@/assets/Icon.svg";
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import apiClient from "@/lib/axios";
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            console.log('response:', codeResponse);
            try {
                const response = await apiClient.post('/auth/login/google', {
                    code: codeResponse.code,
                });
                console.log('Usuário logado:', response.data);

                navigate('/');
            } catch (error) {
                console.error('Erro ao logar:', error);
            }
        },
        flow: 'auth-code', 
    });

    return <GoogleButton label="Entrar com o Google" onClick={() => login()} />;
};

const LoginPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
            <h1 className='font-semibold text-3xl text-white'>Faça login com o google</h1>
            <img
                src={toothLogo}
                alt="Logo medicamentos"
                className="w-64 h-64 object-contain"
            />
            <h1 className="font-extrabold text-3xl text-white">MolarCheck</h1>
            <div className="mt-40">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <GoogleLoginButton/>
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default LoginPage;