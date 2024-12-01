import GoogleButton from 'react-google-button';
import toothLogo from "@/assets/Icon.svg"

const LoginPage = () => {

    function login() {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/login/google`
    }


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
                <GoogleButton label="Entrar com o Google" onClick={login} />
            </div>
        </div>
    );
};

export default LoginPage;